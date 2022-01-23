// Define el componente que gestiona los combates
Vue.component('v-combat', {
    props: {
        tournamentName: {
            type: String,
            required: true
        },
        combat: {
            type: Object,
            required: true 
        }
    },
    data: function () {
        return {
            fighting: false,
            fightingTimer: null,
            card: null,
            COMBAT_ADMONITION: 1,
            COMBAT_EXPULSION: 2,
            T1: 1,
            T2: 2
        }
    },
    methods: {
        //Inicia / para el cronometro
        startStopCombat: function() {

            //solo puede comenzar el combate si no esta finalizado
            this.fighting = !this.fighting;
            if(this.fighting) this.combat.execution.date = moment().format('DD/MM/YYYY');
            this.combat.state = APP_CONSTANTS.COMBAT_STATES.COMBATING;
            if((this.fighting) && (this.combat.state != APP_CONSTANTS.COMBAT_STATES.FINISHED)) {
                this.fightingTimer = setInterval(this.updateCombatTime, 1000);
            } else {
                clearInterval(this.fightingTimer);
            }
            
        },
        percentageTime: function() {
            return ((this.combat.execution.time*100)/this.combat.configuration.maxTime);
        },
        updateCombatTime: function() {
                this.combat.execution.time = this.combat.execution.time+1;
            },
        addPointFighter: function(tirador) {
            this.combat.execution["fighterPoints"+tirador] = this.combat.execution["fighterPoints"+tirador]+1;
        },
        addNoticeFighter: function(tirador) {
            this.combat.execution["fighterNotices"+tirador] = (this.combat.execution["fighterNotices"+tirador]<this.combat.configuration.maxNotices)?this.combat.execution["fighterNotices"+tirador]+1:this.combat.configuration.maxNotices;
        },
        addDouble: function() {
            this.combat.execution.doubles = (this.combat.execution.doubles<this.combat.configuration.maxDoubles)?this.combat.execution.doubles+1:this.combat.configuration.maxDoubles;
        },
        //Limpia los datos de puntos, y tarjetas del tirador seleccionado
        clearFighter: function(tirador) {
            this.combat.execution["fighterPoints"+tirador] = 0;
            this.combat.execution["fighterNotices"+tirador] = 0;
        },
        //limpia los dobles
        clearDoubles: function() {
            this.combat.execution.doubles = 0;
        },
        //Indica quien es el ganador del combate
        setWinner: function(tirador) {

             //solo podemos finalizar si no esta combatiendo            
            if(!this.fighting) {
                this.combat.state = APP_CONSTANTS.COMBAT_STATES.FINISHED;
                if(this.combat.execution.winner == tirador) {
                    this.combat.execution.winner = null;
                    this.combat.state = APP_CONSTANTS.COMBAT_STATES.COMBATING;
                } else {
                    this.combat.execution.winner = tirador;
                }
                
            }

        },
        //muestra una tarjeta de un tipo
        showCard: function(type) {
            this.card = type;
        },
        //muestra una amonestacion
        hideCard: function() {
            this.card = null;
        },
        closeCombat: function() {
            if(!this.fighting) {
                this.$emit('close');
            }
        }
    },
    computed: {
        cardHeight: function() {
            return screen.height*0.90;
        }
    },
    filters: {
        toMinSec: function (value) {
          return moment().startOf('day').seconds(value).format('mm:ss');
        }
    },    
    template: `
        <v-container>

            <div class="mt-0 pt-0" v-show="!card">
                <v-row justify="center" align="center">
                    <v-col class="pa-0 mx-0 d-flex align-center" cols="3">
                        <v-btn class="pa-0" depressed dark color="red" small @click="closeCombat" height=50>
                            <v-icon dark>mdi-arrow-left-circle</v-icon>
                        </v-btn>
                    </v-col>
                    <v-col class="pa-0 mx-0" cols="9">
                        <span class="tournamentName">{{tournamentName}}</span>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="5" class="blue--text combatNames d-flex justify-center align-center">
                        {{combat.fighter1.name}}
                    </v-col>
                    <v-col cols="2" class="d-flex justify-center align-center width:100%">
                    </v-col>
                    <v-col cols="5" class="green--text combatNames d-flex justify-center align-center">
                        {{combat.fighter2.name}}
                    </v-col>
                </v-row>
                <v-row>
                    <!-- Fighter 1 -->
                    <v-col cols="5">
                        <v-row>
                            <div style="position:absolute" v-if="combat.execution.winner==T1"><v-icon class="black--text">mdi-flag-checkered</v-icon></div>
                            <v-col class="blue combatPoints d-flex justify-center align-center" @click="addPointFighter(T1)">
                                {{combat.execution.fighterPoints1}}                               
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="d-flex justify-center align-center combatNotices" @click="addNoticeFighter(T1)">
                                <v-icon class="yellow--text" v-for="(notice,index) in combat.execution.fighterNotices1" :key="index">mdi-card</v-icon>
                            </v-col>
                        </v-row>
                    </v-col>
                    <!-- Doubles -->
                    <v-col cols="2">
                        <v-row>
                            <v-col class="combatDoubles d-flex justify-center align-center">
                                <div @click="addDouble()">{{combat.execution.doubles}}</div>
                            </v-col>
                        </v-row>
                    </v-col>
                    <!-- Fighter 2 -->
                    <v-col cols="5">
                        <v-row>
                            <div style="position:absolute" v-if="combat.execution.winner==T2"><v-icon class="black--text">mdi-flag-checkered</v-icon></div>
                            <v-col class="green combatPoints d-flex justify-center align-center" @click="addPointFighter(T2)">
                                {{combat.execution.fighterPoints2}}
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="d-flex justify-center align-center combatNotices" @click="addNoticeFighter(T2)">
                                <v-icon class="yellow--text" v-for="(notice,index) in combat.execution.fighterNotices2" :key="index">mdi-card</v-icon>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="5" class="d-flex justify-center align-center">
                        <v-btn class="mx-1 grey black--text" small @click="clearFighter(T1)"><v-icon>mdi-eraser</v-icon></v-btn>
                        <v-btn class="mx-1 grey black--text" small  @click="setWinner(T1)"><v-icon>mdi-flag-checkered</v-icon></v-btn>
                    </v-col>
                    <v-col cols="2" class="d-flex justify-center align-center">
                        <v-btn class="mx-1 grey black--text" small @click="clearDoubles()"><v-icon>mdi-eraser</v-icon></v-btn>
                    </v-col>
                    <v-col cols="5" class="d-flex justify-center align-center">
                        <v-btn class="mx-1 grey black--text" small @click="clearFighter(T2)"><v-icon>mdi-eraser</v-icon></v-btn>
                        <v-btn class="mx-1 grey black--text" small @click="setWinner(T2)"><v-icon>mdi-flag-checkered</v-icon></v-btn>
                    </v-col>                    
                </v-row>
                <v-row>
                    <v-col cols="2" class="d-flex justify-center align-end">
                        <v-btn class="yellow black--text" fab large dark @click="showCard(COMBAT_ADMONITION)"><v-icon>mdi-cards</v-icon></v-btn>
                    </v-col>
                    <v-col cols="8" class="d-flex justify-center align-center">
                        <v-progress-circular :rotate="360" :size="200" :width="15" color="teal" v-model="percentageTime()" @click="startStopCombat">
                            <div :class="{ 'red--text': !fighting, 'green--text': fighting, 'combatTime': true}">{{combat.execution.time | toMinSec}} / {{combat.configuration.maxTime | toMinSec}}</div>
                        </v-progress-circular>
                    </v-col>
                    <v-col cols="2" class="d-flex justify-center align-end">
                        <v-btn class="red black--text"  fab large dark @click="showCard(COMBAT_EXPULSION)"><v-icon>mdi-cards</v-icon></v-btn>
                    </v-col>
                </v-row>
            </div>
            <!-- se muestra una tarjeta -->
            <div v-show="card" :style="{ 'height': cardHeight+'px' }" >
                <v-layout class="yellow" style="height:100%" v-show="card==COMBAT_ADMONITION" @click="hideCard()"> 
                </v-layout>
                <v-layout class="red" style="height:100%" v-show="card==COMBAT_EXPULSION" @click="hideCard()"> 
                </v-layout>
            </div>

        </v-container>
    `
});