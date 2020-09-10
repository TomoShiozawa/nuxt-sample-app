import firebase from '~/plugins/firebase'

const db = firebase.firestore()
const bushosCollection = db.collection('bushos')

export const state = () => ({
  bushos: []
})

export const mutations = {
  addBusho(state, busho) {
    state.bushos.push(busho)
  },
  clearBushos(state) {
    state.bushos = []
  }
}

export const actions = {
  fetchBushos({ commit }) {
    commit('clearBushos')
    return bushosCollection
      .get()
      .then((res) => {
        res.forEach((doc) => {
          const busho = Object.assign({ id: doc.id }, doc.data())
          commit('addBusho', busho)
        })
      })
      .catch((err) => {
        console.error(err)
      })
  },
  async updateBusho({ dispatch }, busho) {
    const updatedBusho = bushosCollection.doc(busho.id)
    await updatedBusho.update({
      name: busho.name,
      leadership: busho.leadership,
      valor: busho.valor,
      intelligence: busho.intelligence,
      politics: busho.politics,
      biography: busho.biography
    })
    dispatch('fetchBushos')
  },
  async createBusho({ dispatch }, busho) {
    await bushosCollection.add(busho)
    dispatch('fetchBushos')
  }
}

export const getters = {
  getBushos(state) {
    return state.bushos
  }
}
