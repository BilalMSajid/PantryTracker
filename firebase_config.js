
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyAWYHZw4kbITdXuI0lxYK2PHvhimLWJ4Ak",
  authDomain: "pantry-tracker-947cb.firebaseapp.com",
  projectId: "pantry-tracker-947cb",
  storageBucket: "pantry-tracker-947cb.appspot.com",
  messagingSenderId: "982669875917",
  appId: "1:982669875917:web:e2878343073f7c76a4a784",
  measurementId: "G-L5FP50NM3Z"
};


const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
