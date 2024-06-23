"use client";
import { title } from "@/components/primitives";
import UserList from "@/components/userlist";


export default function ManagerPage() {

	return (
		<div>
			<h1 className={title()}>Permission Manager</h1>
			<UserList />
		</div>
	);
}
