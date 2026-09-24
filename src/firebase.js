import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBEDD2EjbfjhIrJzTaUQxlklVpNJgpSgbY",
  authDomain: "theplottwist.firebaseapp.com",
  projectId: "theplottwist",
  storageBucket: "theplottwist.firebasestorage.app",
  messagingSenderId: "1017380294785",
  appId: "1:1017380294785:web:6b654e15f92cb743f8fd80",
  measurementId: "G-BETW4GHK1X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
