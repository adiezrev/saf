// Define el componente de dialogo para la comporbacion de la accion
Vue.component('v-checking', {
    props: {
        // Comprobación de tipo básico (`null` coincide con cualquier tipo)
        action:  {
            type: Object,
            required: true   
        }
    },
    data: function () {
      return {
          showing: true,
          dialogAction: {
              action: this.action
          }
      }
    },
    methods: {
        cancel: function() {
            this.action.accepted = false;
            this.$emit('cancel',this.action);
        },
        accept: function() {
            this.action.accepted = true;
            this.$emit('accept',this.action);
        }
    },
    template: `
    <v-dialog v-model="showing" persistent max-width="600px">
        <v-card>
        <v-card-title>
            <span class="text-h5">Confirmación de la acción</span>
        </v-card-title>
        <v-card-text>
            <v-container>
            <v-row>
                <v-col cols="12">
                    {{action.text}}
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                ¿Esta seguro?
                </v-col>
            </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="white" text @click="cancel()">Cancelar</v-btn>
            <v-btn color="red" text @click="accept()">Aceptar</v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>`
  })