//constantes
var APP_CONSTANTS = {
    STATE: {
      MENU: 'menu'
    },
    TOURNAMENT_TYPE: {
        FREE: 1,
        REGISTRED: 2
    },
    TOURNAMENT_FREE: {
        CODE: "FS001",
        NAME: "Tiradas libres",
        DESCRIPTION: "Tiradas con amigos por el mero disfrute de ello",
        AVATAR: "./resources/img/tournament/car-saf.png",
        MAXDURATION: 200,
        MAXPOINTS: 12,
        MAXDOUBLES: 3,
        MAXNOTICES: 3
    },
    COMBAT_STATES: {
      PREPARED: 1,
      COMBATING: 2,
      FINISHED: 3
    }
}
//literales
var APP_LITERALS = {
    MESSAGES: {
        SYNCRONIZE_TOURNAMENT: "Esta a punto de sincronizar el torneo seleccionado",
        DELETE_TOURNAMENT: "Esta a punto de borrar el torneo seleccionado",
        DELETE_COMBAT: "Esta a punto de borrar el combate seleccionado"
    }
}

const vm = new Vue({
  el: '#app',
  data: {
    app: {
        initialized: false
    },
    flow: {
      header: true,
      state: {
        welcome: true,
        future: false,
         menu: false,
         create: false,
         tournament: false,
         otros: false
      }
    },
    tournaments: [
        {
          info: {
            code: "T001",
            name: "Tiradas libres",
            description: "Tiradas libres por el mero disfrute.",
            src: "./resources/img/tournament/t-free.jpg",
            type: APP_CONSTANTS.TOURNAMENT_TYPE.FREE
          }
        },
        {
        info: {
            code: "T002",
            name: "Torneo de prueba",
            description: "Torneo reglado de prueba",
            src: "./resources/img/tournament/car-saf.png",
            type: APP_CONSTANTS.TOURNAMENT_TYPE.REGISTRED
          }
        }
    ]
    
  },
  methods: {
    //indica el estado
    setState: function(state) {

        if(state!=APP_CONSTANTS.STATE.MENU) {
          //Si la opcion es distinto de menu borramos el resto
          Object.keys(this.flow.state).forEach( (key)=> {
            this.flow.state[key] = false;
          });
        }
        //Si la opcion no es vladia se vuelve al inicio
        if(this.flow.state[state]!=undefined) {
            this.flow.state[state] = true;
        } else {
            this.flow.state.welcome = true;
        }
    }
  },
  vuetify: new Vuetify(
    {
        theme: { dark: true },
    }),
  mounted() {
      //Cuando se haya preparado todo
      this.app.initialized = true;  
  }
})
//globales
Vue.prototype.$LITERALS= APP_LITERALS;
Vue.prototype.$CONSTANTS= APP_CONSTANTS;