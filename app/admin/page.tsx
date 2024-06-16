"use client";
import { useEffect, useState } from "react";

import LemmeIn from "@/components/adminTools";

export default function AdminPage() {

	const [report, setReport] = useState<any[] | null>(null);

	useEffect(() => {
		LemmeIn().then((report) => {
			setReport(report);
		})
	}, []);

	return (
		<div>
			<ul>
				{
					// sites is an obj with fields: name, storageUsers[], and firestoreUsers[]
					report?.map((site, index) => (
						<li key={index} style={{border: "1px solid gray", margin: "1em", padding: "1em"}}>
							<div style={{display: "flex", flexDirection: "column"}}>
								<h1 style={{fontSize: "1.5em"}}>{site.name}</h1>
								<h2>Storage Users</h2>
								<ul style={{backgroundColor: "darkgray"}}>
									{
										site.storageUsers.map((user: any, index: number) => (
											<li key={index}>{user}</li>
										))
									}
								</ul>
								<h2>Firestore Users</h2>
								<ul style={{backgroundColor: "darkgray"}}>
									{
										site.firestoreUsers.map((user: any, index: number) => (
											<li key={index}>{user}</li>
										))
									}
								</ul>
							</div>
						</li>
					))
				}
			</ul>
		</div>
	);
	
}