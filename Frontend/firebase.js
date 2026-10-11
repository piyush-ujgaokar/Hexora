
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,  
  authDomain: "interviewai-de347.firebaseapp.com",
  projectId: "interviewai-de347",
  storageBucket: "interviewai-de347.firebasestorage.app",
  messagingSenderId: "996368813829",
  appId: "1:996368813829:web:9c431a3f122a4ca761b16c"
};

const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
export const googleProvider= new GoogleAuthProvider()