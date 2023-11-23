// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-da56a.firebaseapp.com",
  projectId: "real-estate-da56a",
  storageBucket: "real-estate-da56a.appspot.com",
  messagingSenderId: "340856235458",
  appId: "1:340856235458:web:1799bdd5a95e951ad6a25b",
  measurementId: "G-YC0TS9PNV8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);