"use client";
import React, { useState, useEffect } from 'react';

import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
} from "firebase/auth";

import { User as FirebaseUser } from "firebase/auth";

import { firebaseConfig } from "../app/key.js"

import { GoogleIcon } from './images';
import { NoUserIcon, UserIcon } from './icons';

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

export const AuthListener = () => {
    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('User is signed in');
            } else {
                console.log('No user is signed in');
            }
        });
    }, []);

    return null;
}

export const SmallAccountStatus = () => {
    const [user, setUser] = useState<FirebaseUser | null>(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
    }, []);

    return (
        <div className="flex gap-2">
            {user ? (
                <div className="flex gap-2">
                    <UserIcon size={24} />
                    <p>{user.displayName}</p>
                </div>
            ) : (
                <div className="flex gap-2">
                    <NoUserIcon size={24} />
                    <button onClick={() => signInWithPopup(auth, provider)}>
                        <GoogleIcon size={22} />
                    </button>
                </div>
            )}
        </div>
    );
}

export const SignOutListener = () => {
    //returns a function that can be used as a listener
    return signOut(auth).then(() => {
        // reload the homepage
        window.location.reload();
    }).catch((error) => {
        console.error(error);
    });
}