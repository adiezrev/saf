// Define el componente para la pantalla principal
Vue.component('v-welcome', {
    data: function () {
      return {
      }
    },
    template: `
    <v-container>
        <v-row class="mt-5">
            <v-col>
                <span class="d-flex justify-center">
                    (S)ala de (A)rmas (F)enix
                </span>
            </v-col>
        </v-row>					
        <v-row>
            <v-col>
                <div class="d-flex flex-column justify-space-between align-center">
                    <v-img src="./resources/img/base/car-saf.png" width="300px"></v-img>
                </div>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <span class="d-flex justify-center">
                Gestión de torneos
                </span>
            </v-col>
        </v-row>	
    </v-container>`
  })