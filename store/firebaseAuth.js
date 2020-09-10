import firebase from '~/plugins/firebase'

export const state = () => ({
  userUid: '',
  userDisplayName: ''
})

export const mutations = {
  setUserUid(state, uid) {
    state.userUid = uid
  },
  setUserDisplayName(state, displayName) {
    state.userDisplayName = displayName
  }
}

export const actions = {
  login(context) {
    const provider = new firebase.auth.GoogleAuthProvider()
    return firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const user = result.user
        context.commit('setUserUid', user.uid)
        context.commit('setUserDisplayName', user.displayName)
      })
      .catch((error) => {
        console.error(error)
      })
  },
  logout(context) {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        context.commit('setUserUid', '')
        context.commit('setUserDisplayName', '')
      })
  },
  authCheck({ commit, dispatch }) {
    return new Promise((resolve) => {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          commit('setUserUid', user.uid)
          commit('setUserDisplayName', user.displayName)
          await dispatch('busho/fetchBushos', null, { root: true })
        }
        resolve()
      })
    })
  }
}

export const getters = {
  getUserUid(state) {
    return state.userUid
  },
  getUserDisplayName(state) {
    return state.userDisplayName
  }
}
