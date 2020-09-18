<template>
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
          <v-dialog v-model="createDialog" width="500" @input="close">
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
                        v-model="tempBusho.name"
                        label="Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model.number="tempBusho.leadership"
                        label="Leadership"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model.number="tempBusho.valor"
                        label="Valor"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model.number="tempBusho.intelligence"
                        label="Intelligence"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model.number="tempBusho.politics"
                        label="Politics"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col sm="12">
                      <v-textarea
                        v-model="tempBusho.biography"
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
        <v-icon small @click.stop="edit(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click.stop="showDeleteDialog(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="editDialog" max-width="500px" @input="close">
      <v-card>
        <v-card-title>
          <span class="headline">Edit</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="tempBusho.name"
                  label="Name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model.number="tempBusho.leadership"
                  label="Leadership"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model.number="tempBusho.valor"
                  label="Valor"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model.number="tempBusho.intelligence"
                  label="Intelligence"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model.number="tempBusho.politics"
                  label="Politics"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col sm="12">
                <v-textarea
                  v-model="tempBusho.biography"
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
    <v-dialog v-model="deleteDialog" max-width="500px" @input="close">
      <v-card>
        <v-card-title>
          <span class="headline"> Delete '{{ tempBusho.name }}' </span>
        </v-card-title>

        <v-card-text>
          <div>Are you sure you want to delete '{{ tempBusho.name }}' ?</div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancelDelete">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteBusho">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'BushoTable',
  props: {
    bushos: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Leadership', value: 'leadership' },
        { text: 'Valor', value: 'valor' },
        { text: 'Intelligence', value: 'intelligence' },
        { text: 'Politics', value: 'politics' },
        { text: 'Biography', value: 'biography' },
        { text: 'Actions', value: 'actions' }
      ],
      search: '',
      editDialog: false,
      createDialog: false,
      deleteDialog: false,
      tempBusho: {},
      newBusho: {
        name: '',
        leadership: 0,
        valor: 0,
        intelligence: 0,
        politics: 0,
        biography: ''
      },
      deletedBusho: {},
      editedIndex: -1
    }
  },
  created() {
    this.tempBusho = Object.assign({}, this.newBusho)
  },
  methods: {
    edit(busho) {
      this.tempBusho = Object.assign({}, busho)
      this.editDialog = true
    },
    save() {
      this.$emit('update', this.tempBusho)
      this.tempBusho = Object.assign({}, this.newBusho)
      this.editDialog = false
    },
    cancel() {
      this.tempBusho = Object.assign({}, this.newBusho)
      this.editDialog = false
    },
    create() {
      this.$emit('create', this.tempBusho)
      this.tempBusho = Object.assign({}, this.newBusho)
      this.createDialog = false
    },
    cancelCreate() {
      this.tempBusho = Object.assign({}, this.newBusho)
      this.createDialog = false
    },
    showDeleteDialog(busho) {
      this.tempBusho = busho
      this.deleteDialog = true
    },
    deleteBusho() {
      this.$emit('delete', this.tempBusho)
      this.tempBusho = Object.assign({}, this.newBusho)
      this.deleteDialog = false
    },
    cancelDelete() {
      this.tempBusho = Object.assign({}, this.newBusho)
      this.deleteDialog = false
    },
    close(value) {
      if (!value) {
        this.tempBusho = Object.assign({}, this.newBusho)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.biography
  max-width: 300px
</style>
