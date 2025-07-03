// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0nMpu-GDfdlONPyfiP5b8YkC4Vo1WsFw",
  authDomain: "moss-x-a7cb3.firebaseapp.com",
  projectId: "moss-x-a7cb3",
  storageBucket: "moss-x-a7cb3.firebasestorage.app",
  messagingSenderId: "950230364080",
  appId: "1:950230364080:web:095749f71cc3615e5db075",
  measurementId: "G-VE5RC2088H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
