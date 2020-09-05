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
      .then(function(result) {
        const user = result.user
        context.commit('setUserUid', user.uid)
        context.commit('setUserDisplayName', user.displayName)
      })
      .catch(function(error) {
        console.error(error)
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
