// Define el componente para informacion de futuro
Vue.component('v-future', {
    data: function () {
      return {
      }
    },
    template: `
    <v-container>
        <v-row class="mt-5">
            <v-col>
                <span class="d-flex justify-center">¿Como podriamos mejorar la aplicacion?</span>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <div class="d-flex flex-column justify-space-between align-center">
                    <v-icon x-large>mdi-comment-question</v-icon>        
                    <!--<v-img src="./resources/img/base/thinking.png" width="300px"></v-img>-->
                </div>
            </v-col>
        </v-row>
        <v-row class="mt-5">
            <v-col>
                <span class="d-flex justify-center"><a href = "mailto: info@salafenix.eu">info@salafenix.eu</a></span>
            </v-col>
        </v-row>
	</v-container>`
  })