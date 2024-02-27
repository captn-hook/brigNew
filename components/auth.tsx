import { initializeApp } from "firebase/app";

import { 
    getAuth, 
    GoogleAuthProvider,
    signOut,
} from "firebase/auth";

import { firebaseConfig } from "../app/key.js"

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();


export const SignOutListener = () => {
    //returns a function that can be used as a listener
    return signOut(auth).then(() => {
        // reload the homepage
        window.location.reload();
    }).catch((error) => {
        console.error(error);
    });
}