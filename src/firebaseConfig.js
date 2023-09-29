import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAgEoRCZNZDOksIXdXjV8mgvauPYDmXOZE",
  authDomain: "saichowk-b3e09.firebaseapp.com",
  projectId: "saichowk-b3e09",
  storageBucket: "saichowk-b3e09.appspot.com",
  messagingSenderId: "1004198228248",
  appId: "1:1004198228248:web:16ddf877e7c3febfc36e6d",
  measurementId: "G-453NF17BWK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app)