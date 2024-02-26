'use client';
import { title } from "@/components/primitives";
import { Button } from "@nextui-org/button";

export default function LogPage() {
	const isLoggedIn = false;

	if (isLoggedIn) {
		//log the user out and redirect to home
		//logout();
		<div>
			<h1 className={title()}>Log Out</h1>
			<br />
			<div style={{ padding: '20px' }}>
				<Button radius="full" onPress={() => console.log('Log Out')}>Log Out</Button>
			</div>
		</div>
	}
	return (
		//log the user in and redirect to home
		<div>
			<h1 className={title()}>Log In</h1>
			<br />
			<div style={{ padding: '20px' }}>
				<Button radius="full" onPress={() => console.log('Log In')}>Log In</Button>
			</div>
		</div>
	);
}

