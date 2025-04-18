import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC5CZL4WSLAJkZS8ILcw1AuergLZ8C8",
  authDomain: "firetrainai.firebaseapp.com",
  projectId: "firetrainai",
  storageBucket: "firetrainai.appspot.com",
  messagingSenderId: "824044770961",
  appId: "1:824044770961:web:bae6d3dc879109d8ccb6ee"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
