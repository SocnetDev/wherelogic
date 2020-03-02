import * as firebase from 'firebase';
const config = {
   apiKey: "AIzaSyC1nDab8z_b3T61lTVYuuSrP7m_TxgQL8k",
   authDomain: "where-logic.firebaseapp.com",
   databaseURL: "https://where-logic.firebaseio.com",
   projectId: "where-logic",
   storageBucket: "where-logic.appspot.com",
   messagingSenderId: "212321058825",
   appId: "1:212321058825:web:0a80064ece6fae8b51f8d8"
}
firebase.initializeApp(config);
export const quests = firebase.firestore().collection('testQ');
export const storage = firebase.storage().ref();
