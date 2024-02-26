"use client";
import { title } from "@/components/primitives";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";

export default function AdminPage() {
	
	const userlist = [
		{
			"username": "Admin 1",
			"email": "example@gmail.com",
			"role": "Admin",
			"sites": -1
		},
		{
			"username": "User 2",
			"email": "example2@gmail.com",
			"role": "User",
			"sites": 4
		},
		{
			"username": "User 3",
			"email": "fake@gmail.com",
			"role": "User",
			"sites": 2
		},
		{
			"username": "Admin 4",
			"email": "ddwda@gmail.com",
			"role": "Admin",
			"sites": -1
		},
	];

	return (
		<div>
			<h1 className={title()}>User Manager</h1>
			<Table>
				<TableHeader>
					<TableColumn>Username</TableColumn>
					<TableColumn>Email</TableColumn>
					<TableColumn>Role</TableColumn>
					<TableColumn>Sites</TableColumn>
				</TableHeader>
				<TableBody>
					{userlist.map((user, index) => (
						<TableRow key={`${user.username}-${index}`}>
							<TableCell>{user.username}</TableCell>
							<TableCell>{user.email}</TableCell>
							<TableCell>{user.role}</TableCell>
							<TableCell>{user.sites}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}