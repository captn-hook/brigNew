import { initializeApp } from "firebase/app";

import { 
    getAuth, 
    GoogleAuthProvider,
    signOut,
} from "firebase/auth";

import {
    getFirestore,
    collection,
    getDocs,
} from "firebase/firestore";

import { getStorage } from "firebase/storage";

import { firebaseConfig } from "../app/key.js"

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export const SignOutListener = () => {
    //returns a function that can be used as a listener
    return signOut(auth).then(() => {
        // reload the homepage
        window.location.reload();
    }).catch((error) => {
        console.error(error);
    });
}

export async function userSites() {
    const sitelist: string[] = [];

    return new Promise(function (resolve, reject) {
        const user = auth.currentUser;
        if (user == null) {
            reject("No user signed in");
        } else {

            getDocs(collection(db, user.uid)).then((querySnapshot) => {

                querySnapshot.forEach((doc) => {
                    if (doc.data().access == true) {

                        sitelist.push(doc.id)

                    }
                    
                    resolve(sitelist);

                });

            }).catch((error) => {
                reject(error);
            });
        }
    });
}

