"use client";
import { Button, ButtonGroup } from "@nextui-org/button";
import { title } from "@/components/primitives";

export default function AccountPage() {
	return (
		<div>
			<h1 className={title()}>Account</h1>
			
			<ButtonGroup>
				<Button onPress={() => console.log('Change Password')}>Change Password</Button>
				<Button onPress={() => console.log('Change Email')}>Change Email</Button>
				<Button onPress={() => console.log('Delete Account')}>Delete Account</Button>
			</ButtonGroup>

		</div>
	);
}
