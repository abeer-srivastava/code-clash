// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { GithubAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPW1ZYwa5kGNPfMMtmmkBBTq7Ng8xFBN8",
  authDomain: "leetcode-clone-28a0f.firebaseapp.com",
  projectId: "leetcode-clone-28a0f",
  storageBucket: "leetcode-clone-28a0f.firebasestorage.app",
  messagingSenderId: "698927432497",
  appId: "1:698927432497:web:9459f42c23c16c3cc16610",
  measurementId: "G-DY1G9JKWRD"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const provider=new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const auth=getAuth(app);