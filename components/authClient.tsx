"use client";

import { useEffect, useState } from "react";

import { useTheme } from "next-themes";
import { Button, ButtonGroup } from '@nextui-org/button';

import {
    getAuth,
    onAuthStateChanged,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";

import { User as FirebaseUser } from "firebase/auth";

import { GoogleIcon } from './images';
import { NoUserIcon, UserIcon } from './icons';

import { auth, provider } from './auth';

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
    const [showSignInModal, setShowSignInModal] = useState(false);

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
                    {<p>{user.displayName ? user.displayName : user.email ? user.email.split('@')[0] : 'Signed In'}</p>}
                </div>
            ) : (
                <div className="flex gap-2">
                    <button onClick={() => setShowSignInModal(true)} className="flex gap-2">
                        <NoUserIcon size={24} /> Sign In
                    </button>
                    <button onClick={() => signInWithPopup(auth, provider)}>
                        <GoogleIcon size={22} />
                    </button>
                </div>
            )}
            {showSignInModal && <SignInModal isOpen={showSignInModal} onClose={() => setShowSignInModal(false)} />}
        </div>
    );
}

export const BigAccountStatus = () => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
    }, []);

    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, username, password)
            .then((userCredential) => {
                setUser(userCredential.user);
            })
            .catch((error) => {
                console.error('Error signing in with password and email', error);
            });
    };

    const handleGSignIn = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                setUser(result.user);
            })
            .catch((error) => {
                console.error('Error signing in with Google', error);
            });
    };

    return (
        <div className="flex gap-2">
            {user ? (
                <div className="flex gap-2">
                    <UserIcon size={24} />
                    <p>{user.displayName ? user.displayName : user.email ? user.email.split('@')[0] : 'Signed In'}</p>
                </div>
            ) : (
                <form className="flex flex-col gap-2">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input"
                        autoComplete="username"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input"
                        autoComplete="current-password"
                    />
                    <button onClick={handleSignIn} className="button text-lg">
                        Sign In
                    </button>
                    <p style={{ textAlign: 'center' }} className="text-sm">or</p>
                    <button onClick={handleGSignIn} className="button text-lg">
                        Sign In with Google
                        <GoogleIcon size={22} style={{ marginTop: '2px', marginLeft: 'auto', marginRight: 'auto' }} />
                    </button>
                </form>
            )}
        </div>
    );
};
interface SignInModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { theme, setTheme } = useTheme();

    const bgcolor = theme === "dark" ? "rgb(10, 10, 10)" : "rgb(240, 240, 240)";
    const color = theme === "dark" ? "white" : "black";

    const [signInButtonColor, setSignInButtonColor] = useState<"primary" | "danger" | "default" | "secondary" | "success" | "warning">('primary');
    const [signUpButtonColor, setSignUpButtonColor] = useState<"primary" | "danger" | "default" | "secondary" | "success" | "warning">('primary');

    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user);
                onClose(); // Close the modal after sign in
            })
            .catch((error) => {
                console.error(error);
                setSignInButtonColor('danger');
                setTimeout(() => setSignInButtonColor('primary'), 400); // Reset color after 1 second
            });
    }
    

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user);
                onClose(); // Close the modal after sign up
            })
            .catch((error) => {
                console.error(error);
                setSignUpButtonColor('danger');
                setTimeout(() => setSignUpButtonColor('primary'), 400); // Reset color after 1 second
            });
    }

    return (
        <form className="flex flex-col gap-2 p-4 rounded-lg shadow-lg"
            style={{
                position: "fixed",
                top: "150%", left: "75%",
                transform: "translate(-50%, -50%)",
                backgroundColor: bgcolor, color: color, zIndex: 1000
            }}
        >
            <input
                className="rounded-sm"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
            />
            <input
                className="rounded-sm"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
            />
            <ButtonGroup>
                <Button radius="full" color={signInButtonColor} onPress={handleSignIn}>Sign In</Button>
                <Button radius="full" color={signUpButtonColor} onPress={handleSignUp}>Sign Up</Button>
                <Button radius="full" color="default" onPress={onClose}>Close</Button>
            </ButtonGroup>
        </form>
    );
}