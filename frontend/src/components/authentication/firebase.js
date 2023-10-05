import { initializeApp } from 'firebase/app';
import {
    GoogleAuthProvider,
    FacebookAuthProvider,
    getAuth 
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBuvQM-XBWmKeWDjLgER9hEOfpfolrT27s",
    authDomain: "csci5410-serverless-387216.firebaseapp.com",
    projectId: "csci5410-serverless-387216",
    storageBucket: "csci5410-serverless-387216.appspot.com",
    messagingSenderId: "326668763826",
    appId: "1:326668763826:web:9abec5b1d38e6d4c74ffab"
};

const firebase = initializeApp(firebaseConfig);

export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

export default firebase;
