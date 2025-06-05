// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC83TXKICIHvZBFMIExH9kJBE8EkeQoGT8",
  authDomain: "ai-budget-app-14918.firebaseapp.com",
  projectId: "ai-budget-app-14918",
  storageBucket: "ai-budget-app-14918.firebasestorage.app",
  messagingSenderId: "1095420078298",
  appId: "1:1095420078298:web:e6e5b8abdee3a14d3f1de3",
  measurementId: "G-JCG6X7H7JH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);

export default app;
