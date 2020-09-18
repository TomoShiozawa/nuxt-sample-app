<template>
  <div>
    <div
      v-if="!this.$store.getters['firebaseAuth/isAuthenticated']"
      class="text-center"
    >
      <div class="text-h4">
        You need to login.
      </div>
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
      <BushoTable
        :bushos="bushos"
        @create="create"
        @update="update"
        @delete="deleteBusho"
      />
    </div>
  </div>
</template>

<script>
import BushoTable from '~/components/BushoTable'

export default {
  components: {
    BushoTable
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
    update(busho) {
      this.$store.dispatch('busho/updateBusho', busho)
    },
    create(busho) {
      this.$store.dispatch('busho/createBusho', busho)
    },
    deleteBusho(busho) {
      this.$store.dispatch('busho/deleteBusho', busho)
    }
  }
}
</script>
