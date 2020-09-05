<template>
  <div>
    <div v-if="!this.$store.getters['firebaseAuth/getUserUid']">
      <v-btn @click="login">
        ログイン
      </v-btn>
    </div>
    <div v-else>
      <h1>
        こんにちは、{{ this.$store.getters['firebaseAuth/getUserDisplayName'] }}
      </h1>
    </div>
    <div>
      <v-data-table :headers="headers" :items="bushos" :items-per-page="20">
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small @click.stop="editItem(item)">
            mdi-pencil
          </v-icon>
        </template>
      </v-data-table>
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Edit</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="editedBusho.name"
                    label="Name"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model.number="editedBusho.leadership"
                    label="Leadership"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model.number="editedBusho.valor"
                    label="Valor"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model.number="editedBusho.intelligence"
                    label="Intelligence"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model.number="editedBusho.politics"
                    label="Politics"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancel">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Leadership', value: 'leadership' },
        { text: 'Valor', value: 'valor' },
        { text: 'Intelligence', value: 'intelligence' },
        { text: 'Politics', value: 'politics' },
        { text: 'Actions', value: 'actions' }
      ],
      editedBusho: {
        id: '',
        name: '',
        leadership: 0,
        valor: 0,
        intelligence: 0,
        politics: 0
      },
      editedIndex: -1
    }
  },
  computed: {
    bushos() {
      return this.$store.getters['busho/getBushos']
    }
  },
  methods: {
    async login() {
      await this.$store.dispatch('firebaseAuth/login')
      if (this.$store.getters['firebaseAuth/getUserUid']) {
        await this.$store.dispatch('busho/fetchBushos')
      }
    },
    editItem(busho) {
      this.editedIndex = this.bushos.indexOf(busho)
      this.editedBusho = Object.assign({}, busho)
      this.dialog = true
    },
    save() {
      this.$store.dispatch('busho/updateBusho', this.editedBusho)
      this.dialog = false
    },
    cancel() {
      this.dialog = false
    }
  }
}
</script>
