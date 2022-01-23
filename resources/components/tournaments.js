// Define el componente que gestiona los torneos
Vue.component('v-tournaments', {
    data: function () {
      return {
        loading: true,
        tournaments: [],
        selectedTournament: null,
        checkDialog: {
            show: false,
            action: {
                code: null,
                text: null
            }
        },
        loadDialog: {
            show: false,
            code: null,
            password: null
        },
        ACTIONS: {
            SYNC: 1,
            DELETE: 2
        }
      }
    },
    methods: {
        openLoadDialog: function() {
            this.loadDialog.show = true;
        },
        closeLoadDialog: function() {
            this.loadDialog.show = false;
        },
        saveLoadDialog: function() {
            fncSrvTournamentLoad(this.loadDialog.code,this.loadDialog.password,this.tournaments).finally( () => {
                this.loadDialog.show = false;
                this.loadDialog.code = null;
                this.loadDialog.password = null;
            });
            
        },
        openCheckDialog: function(code,action) {
            this.checkDialog.action.action = action;
            this.checkDialog.action.code = code;
            this.checkDialog.action.text = (action==this.ACTIONS.DELETE)?this.$LITERALS.MESSAGES.DELETE_TOURNAMENT:this.$LITERALS.MESSAGES.SYNCRONIZE_TOURNAMENT;
            this.checkDialog.show = true;
        },
        cancelCheckDialog: function() {
            this.checkDialog.show = false;
            this.checkDialog.action.text = null;
            this.checkDialog.action.code = null;
            this.checkDialog.action.action = null;
        },
        saveCheckDialog: function(action) {
            let execPromise = (action.action==this.ACTIONS.DELETE)?fncSrvTournamentDelete(action.code,this.tournaments):fncSrvTournamentSyncronize(action.code,this.tournaments);

            execPromise.then( (tournaments) => {
                this.tournaments = tournaments;
                this.checkDialog.show = false;
                this.checkDialog.action.text = null;
                this.checkDialog.action.code = null;
                this.checkDialog.action.action = null;
            });
            
        },
        showCombats: function(code) {
            //this.selectedTournament = this.tournaments.find( (tournament)=> { return tournament.info.code == code });
            fncSrvTournamentGet(code).then( (tournament)=> {
                this.selectedTournament = tournament;
                vm.$data.flow.header = false;
            });

        },
        hideCombats: function() {
            vm.$data.flow.header = true;
            this.selectedTournament = null;
        }
    },
    mounted() {
        fncSrvTournamentsList().then( (tournaments) => {
            this.tournaments = tournaments;
            this.loading = false;     
        });
    },
    template: `
    <v-container>

        <div class="text-center" v-if="loading">
            <!-- cargando -->
            <v-progress-circular :size="50" color="red" indeterminate></v-progress-circular>
        </div>
        <div v-else>
            <!-- cargado -->
            <div v-show="!selectedTournament">
                <v-row>
                    <v-col>
                        <v-btn class="mx-2" fab dark small color="red" @click="openLoadDialog()">
                            <v-icon dark>mdi-plus-circle-outline</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-list three-line>
                        <template v-for="(tournament, index) in tournaments">
                            <v-divider :key="index" :inset="true"></v-divider>
                            
                            <v-list-item :key="tournament.info.code" @click="showCombats(tournament.info.code)">
                                <v-list-item-avatar>
                                    <v-img :src="tournament.info.src"></v-img>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title>{{tournament.info.name}} ({{tournament.timestamp}})</v-list-item-title>
                                    <v-list-item-subtitle >{{tournament.info.description}}</v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <div class="text-center" v-if="tournament.info.type==$CONSTANTS.TOURNAMENT_TYPE.REGISTRED">
                                        <v-btn color="red" @click.stop="openCheckDialog(tournament.info.code,ACTIONS.SYNC)">
                                            <v-icon>mdi-sync</v-icon>
                                        </v-btn>
                                        <v-btn color="red" @click.stop="openCheckDialog(tournament.info.code,ACTIONS.DELETE)">
                                            <v-icon>mdi-delete</v-icon>
                                        </v-btn>
                                    </div>
                                </v-list-item-action>
                            </v-list-item>
                        </template>
                    </v-list>
                    </v-col>
                </v-row>

                <!-- Ventana para añadir un torneo -->
                <v-dialog v-model="loadDialog.show" persistent max-width="600px">
                    <v-card>
                    <v-card-title>
                        <span class="text-h5">Gestionar un nuevo torneo</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                        <v-row>
                            <v-col cols="12">
                            <v-text-field label="Código del torneo*" v-model="loadDialog.code" required maxlength="20"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                            <v-text-field label="Password*" type="password" v-model="loadDialog.password" required maxlength="20"></v-text-field>
                            </v-col>
                        </v-row>
                        </v-container>
                        <small>* Campo obligatorio</small>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="white" text @click="closeLoadDialog()">Cancelar</v-btn>
                        <v-btn color="red" text @click="saveLoadDialog()">Cargar</v-btn>
                    </v-card-actions>
                    </v-card>
                </v-dialog>

                <!-- Ventana de comprobar la accion -->
                <v-checking v-if="checkDialog.show" :action="checkDialog.action" @cancel="cancelCheckDialog" @accept="saveCheckDialog"></v-checking>
            </div>
            <!-- fin del else -->
        </div>

        <div v-if="selectedTournament">
            <v-row>
                <v-col>
                    <!-- ventana con el torneo seleccionado -->
                    <v-combats :tournament="selectedTournament" @close="hideCombats()"></v-combats>
                </v-col>
            </v-row>
        </div>

    </v-container>`
    
  })