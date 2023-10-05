// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-_-MMfNktXdHb5UwwSFn7P096aTkVewM",
  authDomain: "sdp-project-93d00.firebaseapp.com",
  projectId: "sdp-project-93d00",
  storageBucket: "sdp-project-93d00.appspot.com",
  messagingSenderId: "315704280380",
  appId: "1:315704280380:web:9c7d1aa89cfcfecd890a39",
  measurementId: "G-Q72NL75N21",
};

// Initialize Firebase
const app2 = initializeApp(firebaseConfig, "app2");
const analytics = getAnalytics(app2);
export const db = getFirestore(app2);
