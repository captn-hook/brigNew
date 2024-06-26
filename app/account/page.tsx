"use client";
import { Button, ButtonGroup } from "@nextui-org/button";
import { title } from "@/components/primitives";

import { getAuth, updateEmail, sendPasswordResetEmail, deleteUser } from "firebase/auth";

export default function AccountPage() {
	return (
		<div>
			<h1 className={title()}>Account</h1>

			<ButtonGroup className="content-center" style={{ marginTop: '2rem' }}>
				<Button onPress={() => {
					const auth = getAuth();
					if (auth.currentUser && auth.currentUser.email) {
						sendPasswordResetEmail(auth, auth.currentUser.email).then(() => {
							alert('Password reset email sent');
							console.log('Password reset email sent');
						}).catch((error) => {
							console.error(error);
						});
					}
				}}>Password Reset</Button>
				<Button onPress={() => {
					const auth = getAuth();
					const newE = prompt('Enter new email');
					if (auth.currentUser && newE) {
						updateEmail(auth.currentUser, newE).then(() => {
							console.log('Email updated');
						}).catch((error) => {
							console.error(error);
						});
					}
				}}>Change Email</Button>
				<Button onPress={() => {
					const auth = getAuth();
					if (auth.currentUser) {
						deleteUser(auth.currentUser).then(() => {
							console.log('User deleted');
						}).catch((error) => {
							console.error(error);
						});
					}
				}
				}>Delete Account</Button>
			</ButtonGroup>

		</div>
	);
}
