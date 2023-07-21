// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1qjYomq6OWiCaBVcZeJeFn-dDx8MHp9E",
  authDomain: "pruebatecnica1-c39a3.firebaseapp.com",
  projectId: "pruebatecnica1-c39a3",
  storageBucket: "pruebatecnica1-c39a3.appspot.com",
  messagingSenderId: "1047282136832",
  appId: "1:1047282136832:web:89a811843dce8f57c525e5",
  measurementId: "G-WVG4897GFX"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const storage = getStorage(firebaseApp, "gs://pruebatecnica1-c39a3.appspot.com");

export default firebaseApp;

