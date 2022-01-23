// Define el componente que gestiona los combates
Vue.component('v-combats', {
    props: {
        tournament: {
            type: Object,
            required: true 
        }
    },
    data: function () {
      return {
          //combate seleccionado
        selectedCombat: null,
        markedcombats: [],
          //dialogo de confirmacion
        checkDialog: {
            show: false,
            action: {
                code: null,
                text: null
            }
        },
        //informacion del dialogo
        addDialog: {
            show: false,
            valid: true,
            data: {
                actualFighters: [],
                fighterCode1: null,
                fighterCode2: null,
                fighter1: null,
                fighter2: null,
                maxTime: null,
                maxPoints: null,
                maxDoubles: null,
                maxNotices: null
            }
        },
        //reglas
        rules: {
            required(value) { return fncValidateRequired(value) },
            name(value) { return fncValidateName(value) },
            number(value) { return fncValidateNumber(value) },
            time(value) { return fncValidateTime(value) }
        },
        //acciones en la pantalla
        ACTIONS: {
            DELETE: 1
        }
      }
    },
    watch: {
        addDialog: {
            handler(combatDialog){
                this.addDialog.data.fighterCode1 = (combatDialog.data.fighter1==null)?"":combatDialog.data.fighter1.split(' ').map( (word) => word[0]).join("");
                this.addDialog.data.fighterCode2 = (combatDialog.data.fighter2==null)?"":combatDialog.data.fighter2.split(' ').map( (word) => word[0]).join("");
            },
            deep: true
         },
    },
    computed: {
        combatsPrepared: function () {

            return this.tournament.combats.map( (element=> {
                return {
                    code: element.code,
                    fighter1: this.tournament.fighters[element.info.fighter1],
                    fighter2: this.tournament.fighters[element.info.fighter2]
                }
            }));
         },
        //hay combates marcados
        hasMarkedcombats: function() {
            return (this.markedcombats.length>0)?true:false;
        },
    },
    methods: {
        //son tiradas libres
        isFree: function() {
            return this.tournament.info.type == APP_CONSTANTS.TOURNAMENT_TYPE.FREE;
        },
        openAddDialog: function() {
            //ponemos los valores por defecto
            this.addDialog.data.actualFighters = this.actualFightersPrepared();
            this.addDialog.data.maxTime = moment({}).startOf('day').seconds(this.tournament.configuration.combat.maxDuration).format('mm:ss');
            this.addDialog.data.maxPoints = this.tournament.configuration.combat.maxPoints; 
            this.addDialog.data.maxDoubles = this.tournament.configuration.combat.maxDoubles; 
            this.addDialog.data.maxNotices = this.tournament.configuration.combat.maxNotices; 
            this.addDialog.show = true;
        },
        closeAddDialog: function() {
            this.addDialog.show = false;
            this.$refs.form.resetValidation();
            this.$refs.form.reset();
        },
        saveAddDialog: function() {
            //comprobamos si se cumple todo
            if(this.$refs.form.validate()) {
                this.addCombat(JSON.parse(JSON.stringify(this.addDialog.data)))
                this.$refs.form.resetValidation();
                this.$refs.form.reset();
                this.addDialog.show = false;
                this.actualizarTorneo();
            }
        },
        openCheckDialog: function(code,action) {
            this.checkDialog.action.action = action;
            this.checkDialog.action.code = code;
            this.checkDialog.action.text = (action==this.ACTIONS.DELETE)?this.$LITERALS.MESSAGES.DELETE_COMBAT:null;
            this.checkDialog.show = true;
        },
        cancelCheckDialog: function() {
            this.checkDialog.show = false;
            this.checkDialog.action.text = null;
            this.checkDialog.action.code = null;
            this.checkDialog.action.action = null;
        },
        saveCheckDialog: function(action) {
            this.removeCombat(action.code);
            this.checkDialog.show = false;
            this.checkDialog.action.text = null;
            this.checkDialog.action.code = null;
            this.checkDialog.action.action = null;
            this.actualizarTorneo();
        },
        //añade un combate
        addCombat: function(combat) {
            //Si no existe, creamos los tiradorres
            if(this.tournament.fighters[combat.fighterCode1]==null) {
                this.tournament.fighters = fncSrvFighterAdd(fncCreateFighter(combat.fighterCode1,combat.fighter1),this.tournament.fighters);
            }
            if(this.tournament.fighters[combat.fighterCode2]==null) {
                this.tournament.fighters = fncSrvFighterAdd(fncCreateFighter(combat.fighterCode2,combat.fighter2),this.tournament.fighters);
            }
            var combatCode = combat.fighterCode1+"_"+combat.fighterCode2+"_"+(moment().format('DDMMYYYYHHmmss'));
            //ponemos el tiempo en segundos
            combat.maxTime = moment(combat.maxTime, "mm:ss").diff(moment().startOf('day'), 'seconds');
            this.tournament.combats = fncSrvCombatAdd(fncCreateCombat(combatCode,combat),this.tournament.combats);
            this.tournament.timestamp = moment().format('DD-MM-YYYY HH:mm:ss');
            
        },
        //Borra un combate
        removeCombat: function(code) {
            this.tournament.combats = fncSrvCombatDelete(code,this.tournament.combats);
            this.tournament.timestamp = moment().format('DD-MM-YYYY HH:mm:ss');
        },
        //muestra el combat
        showCombat: function(code) {
            this.selectedCombat = this.tournament.combats.find( (combat)=> { return combat.info.code == code });
            this.selectedCombat.fighter1 = this.tournament.fighters[this.selectedCombat.info.fighter1];
            this.selectedCombat.fighter2 = this.tournament.fighters[this.selectedCombat.info.fighter2];
        },
        hideCombat: function() {
            this.selectedCombat.fighter1 = null;
            this.selectedCombat.fighter2 = null;
            //salvamos los datos del combate
            fncDbTournamentAddUpdate(this.tournament);
            this.selectedCombat = null;
        },
        //obtiene el nombre de un tiradro a aprtir de su codigo
        getFighterName: function(fighterCode) {
            let fighterElement = this.tournament.fighters[fighterCode];
            return (fighterElement!=null)?fighterElement.name:"";
        },
        //prepara el formato necesario para su uso
        actualFightersPrepared: function() {
            return Object.values(this.tournament.fighters).map( (element) => element.name);
         },
         //actualiza la informacion del torneo
         actualizarTorneo: function() {
            fncSrvTournamentUpdate(this.tournament);
         },
         //cara del ganador del combate
         getCombatWinnerAvatar: function() {
            return "./resources/img/base/swords.png";
         },
         //marca el elemento
         markCombat: function(index) {
            this.markedcombats[index]=!this.markedcombats[index];
         },
        //indica si esta seleccionado o no el combate
        isSelected: function(combatCode) {
            return this.selection.ids.has(combatCode);
        },         
         //indica el estado del combat
         isPrepared: function(state) {
            return ((state==null)||(APP_CONSTANTS.COMBAT_STATES.PREPARED == state));
         },
         isCombating: function(state) {
            return ((state!=null)&&(APP_CONSTANTS.COMBAT_STATES.COMBATING == state));
         },
         isFinished: function(state) {
            return ((state!=null)&&(APP_CONSTANTS.COMBAT_STATES.FINISHED == state));
         }

    },
    filters: {
        toMinSec: function (value) {
          return moment().startOf('day').seconds(value).format('mm:ss');
        },
        toDateFormat: function(value) {

            if(value==null) {
                return "--/--/----";
            } else {
                return value;
            }

        }
    }, 
    mounted() {
        this.markedcombats[0] = false;
        this.markedcombats[1] = false;
    },
    template: `
        <v-container class="ma-0 pa-0">
        <!-- listado de combates -->
        <div v-show="!selectedCombat">
            <v-row>
                <v-col cols="3">
                    <v-btn class="mx-2" depressed dark color="red" @click="$emit('close')">
                        <v-icon dark>mdi-arrow-left-circle</v-icon>
                    </v-btn>
                </v-col>
                <v-col cols="9" class="d-flex justify-end">
                    <v-btn class="mx-2" fab dark small color="red" @click="openAddDialog()" v-if="(isFree() && this.hasMarkedcombats)">
                        <v-icon dark>mdi-plus-circle-outline</v-icon>
                    </v-btn>
                    <v-btn class="mx-2" fab dark small color="red" @click="openAddDialog()" v-if="isFree()">
                        <v-icon dark>mdi-plus-circle-outline</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-list three-line>
                    <template v-for="(combat, index) in tournament.combats">
                        <v-divider :key="index" :inset="true"></v-divider>
                        
                        <v-list-item :key="combat.info.code" @click="showCombat(combat.info.code)">
                            <!--
                            <v-list-item-avatar>
                                <v-img :src="getCombatWinnerAvatar()"></v-img>
                            </v-list-item-avatar>
                            -->
                            <div class="combatState" :class="{ combatPrepared: isPrepared(combat.state), combatExecuting: isCombating(combat.state), combatFinished: isFinished(combat.state) }" ></div>                            
                            <v-list-item-content>
                                <v-list-item-title>{{getFighterName(combat.info.fighter1)}} <v-icon class="red--text" v-show="combat.execution.winner==1">mdi-flag-checkered</v-icon> vs <v-icon class="red--text" v-show="combat.execution.winner==2">mdi-flag-checkered</v-icon> {{getFighterName(combat.info.fighter2)}}</v-list-item-title>
                                <v-list-item-subtitle >{{combat.execution.fighterPoints1}} - {{combat.execution.fighterPoints2}}&nbsp;&nbsp;&nbsp;Dobles:&nbsp;{{combat.execution.doubles}}&nbsp;&nbsp;&nbsp;({{combat.execution.time | toMinSec}})</v-list-item-subtitle>
                                <v-list-item-subtitle >{{combat.execution.date | toDateFormat}}</v-list-item-subtitle >
                            </v-list-item-content>
                            <v-list-item-action>
                                <div class="text-center">
                                    <v-btn color="red" small @click.stop="openCheckDialog(combat.info.code,ACTIONS.DELETE)">
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                </div>
                            </v-list-item-action>
                        </v-list-item>
                    </template>
                </v-list>
                </v-col>
            </v-row>
        </div>
        <!-- combate en particular -->
        <div v-if="selectedCombat">
            <v-row>
                <v-col>
                    <v-combat :tournamentName="tournament.info.name" :combat="selectedCombat" @close="hideCombat()" ></v-combat>
                </v-col>
            </v-row>
        </div>

        <!-- Ventana para añadir un torneo -->
        <v-dialog v-model="addDialog.show" persistent max-width="600px" @save="console.log('aaa')">
            <v-form ref="form" v-model="addDialog.valid" lazy-validation>
                <v-card>
                <v-card-title>
                    <span class="text-h5">Nuevo combate</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                    <v-row>
                        <v-col cols="6">
                            <v-combobox label="Tirador 1*" v-model="addDialog.data.fighter1" :items="addDialog.data.actualFighters" :rules="[rules.required, rules.name]" clearable required  maxlength="50"></v-combobox>
                            <!--<v-text-field label="Tirador 1*" v-model="addDialog.data.fighter1" :rules="[rules.required, rules.name]" required maxlength="50"></v-text-field>-->
                        </v-col>
                        <v-col cols="6">
                            <v-combobox label="Tirador 2*" v-model="addDialog.data.fighter2" :items="addDialog.data.actualFighters" :rules="[rules.required, rules.name]" clearable required  maxlength="50"></v-combobox>
                            <!--<v-text-field label="Tirador 2*" v-model="addDialog.data.fighter2" :rules="[rules.required, rules.name]" required maxlength="50"></v-text-field>-->
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="6">
                            <v-text-field v-model="addDialog.data.maxTime" label="Duración*" type="time" :rules="[rules.required, rules.time]" required maxlength="5"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field label="Puntos*" v-model="addDialog.data.maxPoints" :rules="[rules.required, rules.number]" required maxlength="2"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="6">
                            <v-text-field label="dobles*" v-model="addDialog.data.maxDoubles" :rules="[rules.required, rules.number]" required maxlength="2"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field label="Amonestaciones*" v-model="addDialog.data.maxNotices" :rules="[rules.required, rules.number]" required> maxlength="2"</v-text-field>
                        </v-col>
                    </v-row>
                    </v-container>
                    <small>* Campo obligatorio</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="white" text @click="closeAddDialog()">Cancelar</v-btn>
                    <v-btn color="red" text @click="saveAddDialog()">Crear</v-btn>
                </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>

        <!-- Ventana de comprobar la accion -->
        <v-checking v-if="checkDialog.show" :action="checkDialog.action" @cancel="cancelCheckDialog" @accept="saveCheckDialog"></v-checking>

        </v-container>
    `
});
