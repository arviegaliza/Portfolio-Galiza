import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDtW4nkD2lcZXPftSm_pqchCdreTc-uYuE",
  authDomain: "portfolio-7ba4f.firebaseapp.com",
  projectId: "portfolio-7ba4f",
  storageBucket: "portfolio-7ba4f.firebasestorage.app",
  messagingSenderId: "653043312859",
  appId: "1:653043312859:web:f23f10ead77019b63084fe",
  measurementId: "G-X07GXC5CVL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore (THIS IS WHAT YOU NEED)
export const db = getFirestore(app);