import firebase from 'firebase';


if (firebase.apps.length === 0){
const firebaseConfig = {
 apiKey: "AIzaSyDog4pAQAQcB3NRZxXIp_Tp2mCFmJw6Upc",
    authDomain: "saborcitosvproyecto.firebaseapp.com",
    projectId: "saborcitosvproyecto",
    storageBucket: "saborcitosvproyecto.appspot.com",
    messagingSenderId: "249677646585",
    appId: "1:249677646585:web:75c6e320765c3a54dc7028"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
}
export default firebase;