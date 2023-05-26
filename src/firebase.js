// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database";
import {getAuth} from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvOpMUhRryhjwMowwi9mtpPtlnbatfBAY",
  authDomain: "blokrent-a538b.firebaseapp.com",
  projectId: "blokrent-a538b",
  storageBucket: "blokrent-a538b.appspot.com",
  messagingSenderId: "471231783111",
  appId: "1:471231783111:web:d05f711881656385115ee2",
  measurementId: "G-43LZQ7VFMH",
  databaseURL : "https://blokrent-a538b-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

