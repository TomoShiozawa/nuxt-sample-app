import firebase from '~/plugins/firebase'

export const state = () => ({
  userUid: '',
  userDisplayName: '',
  isAuthenticated: false
})

export const mutations = {
  setUserUid(state, uid) {
    state.userUid = uid
  },
  setUserDisplayName(state, displayName) {
    state.userDisplayName = displayName
  },
  authenticate(state) {
    state.isAuthenticated = true
  },
  unauthenticate(state) {
    state.isAuthenticated = false
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
        context.commit('authenticate')
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
        context.commit('unauthenticate')
      })
  },
  authCheck({ commit, dispatch }) {
    return new Promise((resolve) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          commit('setUserUid', user.uid)
          commit('setUserDisplayName', user.displayName)
          commit('authenticate')
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
  },
  isAuthenticated(state) {
    return state.isAuthenticated
  }
}
