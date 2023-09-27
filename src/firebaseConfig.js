// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgEoRCZNZDOksIXdXjV8mgvauPYDmXOZE",
  authDomain: "saichowk-b3e09.firebaseapp.com",
  projectId: "saichowk-b3e09",
  storageBucket: "saichowk-b3e09.appspot.com",
  messagingSenderId: "1004198228248",
  appId: "1:1004198228248:web:16ddf877e7c3febfc36e6d",
  measurementId: "G-453NF17BWK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app)