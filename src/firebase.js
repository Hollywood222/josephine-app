// firebase.js - Live memory brain for Josephine
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Josephine’s Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBiqiMw4_hXBQquPf15HPWSEKWNS-uK1jA",
  authDomain: "eden-sent-josephine.firebaseapp.com",
  projectId: "eden-sent-josephine",
  storageBucket: "eden-sent-josephine.firebasestorage.app",
  messagingSenderId: "59560797704",
  appId: "1:59560797704:web:f21570e4119481468713bd"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);