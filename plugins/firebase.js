import firebase from 'firebase'

const firebaseConfig = {
  apiKey: 'AIzaSyD3jnwGYeUt_2wpI58Pqt9-EKx55KMNMqk',
  authDomain: 'my-nuxt-app-36d83.firebaseapp.com',
  databaseURL: 'https://my-nuxt-app-36d83.firebaseio.com',
  projectId: 'my-nuxt-app-36d83',
  storageBucket: 'my-nuxt-app-36d83.appspot.com',
  messagingSenderId: '1075847444047',
  appId: '1:1075847444047:web:143a6e8b31bb7868959c3a',
  measurementId: 'G-XGNWSHEM1P'
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export default firebase
