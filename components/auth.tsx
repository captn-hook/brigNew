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

    const handleSignOut = async () => {
        await signOut(auth);
    }

    return (
        <div className="flex gap-2">
            {user ? (
                <div className="flex gap-2">
                    <p>{user.displayName}</p>
                    <button onClick={handleSignOut}>Sign Out</button>
                </div>
            ) : (
                <button onClick={() => signInWithPopup(auth, provider)}>Sign in with Google</button>
            )}
        </div>
    );
}