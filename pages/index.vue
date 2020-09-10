<template>
  <div>
    <div v-if="!this.$store.getters['firebaseAuth/isAuthenticated']">
      <v-btn @click="login">
        ログイン
      </v-btn>
    </div>
    <div v-else>
      <h1>
        こんにちは、{{ this.$store.getters['firebaseAuth/getUserDisplayName'] }}
      </h1>
      <v-btn @click="logout">
        ログアウト
      </v-btn>
    </div>
    <div>
      <v-data-table
        :headers="headers"
        :items="bushos"
        :items-per-page="20"
        :search="search"
      >
        <template v-slot:top>
          <v-toolbar>
            <v-toolbar-title>
              Busho
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              placeholder="Search"
              prepend-inner-icon="mdi-magnify"
              dense
            />
            <v-spacer></v-spacer>
            <v-dialog v-model="createDialog" width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" v-bind="attrs" v-on="on">
                  New Busho
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">New Busho</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="newBusho.name"
                          label="Name"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model.number="newBusho.leadership"
                          label="Leadership"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model.number="newBusho.valor"
                          label="Valor"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model.number="newBusho.intelligence"
                          label="Intelligence"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model.number="newBusho.politics"
                          label="Politics"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col sm="12">
                        <v-textarea
                          v-model="newBusho.biography"
                          auto-grow
                          label="Biography"
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="cancelCreate">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="create">
                    Create
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.biography`]="{ item }">
          <div class="biography">
            <v-expansion-panels flat hover tile>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <div class="text-truncate">
                    {{ item.biography }}
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  {{ item.biography }}
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </template>
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
              <v-row>
                <v-col sm="12">
                  <v-textarea
                    v-model="editedBusho.biography"
                    auto-grow
                    label="Biography"
                  ></v-textarea>
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
      createDialog: false,
      search: '',
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Leadership', value: 'leadership' },
        { text: 'Valor', value: 'valor' },
        { text: 'Intelligence', value: 'intelligence' },
        { text: 'Politics', value: 'politics' },
        { text: 'Biography', value: 'biography' },
        { text: 'Actions', value: 'actions' }
      ],
      editedBusho: {
        id: '',
        name: '',
        leadership: 0,
        valor: 0,
        intelligence: 0,
        politics: 0,
        biography: ''
      },
      newBusho: {
        name: '',
        leadership: 0,
        valor: 0,
        intelligence: 0,
        politics: 0,
        biography: ''
      },
      editedIndex: -1
    }
  },
  computed: {
    bushos() {
      return this.$store.getters['busho/getBushos']
    }
  },
  async created() {
    await this.$store.dispatch('firebaseAuth/authCheck')
    if (this.$store.getters['firebaseAuth/isAuthenticated']) {
      await this.$store.dispatch('busho/fetchBushos')
    }
  },
  methods: {
    async login() {
      await this.$store.dispatch('firebaseAuth/login')
      if (this.$store.getters['firebaseAuth/isAuthenticated']) {
        await this.$store.dispatch('busho/fetchBushos')
      }
    },
    async logout() {
      await this.$store.dispatch('firebaseAuth/logout')
      this.$store.dispatch('busho/clearBushos')
    },
    editItem(busho) {
      this.editedBusho = Object.assign({}, busho)
      this.dialog = true
    },
    save() {
      this.$store.dispatch('busho/updateBusho', this.editedBusho)
      this.dialog = false
    },
    cancel() {
      this.dialog = false
    },
    create() {
      this.$store.dispatch('busho/createBusho', this.newBusho)
      this.createDialog = false
      this.newBusho = {
        name: '',
        leadership: 0,
        valor: 0,
        intelligence: 0,
        politics: 0,
        biography: ''
      }
    },
    cancelCreate() {
      this.createDialog = false
      this.newBusho = {
        name: '',
        leadership: 0,
        valor: 0,
        intelligence: 0,
        politics: 0,
        biography: ''
      }
    }
  }
}
</script>

<style>
.biography {
  max-width: 300px;
}
</style>
