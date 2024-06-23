"use client";
import { useEffect, useState } from "react";

import { auth } from "@/components/auth";
import LemmeIn from "@/components/adminTools";

export default function AdminPage() {


	const [report, setReport] = useState<any[] | null>(null);

	useEffect(() => {
		console.log("running report");
		LemmeIn().then((report) => {
			setReport(report);
		})
	}, []);

	return (
		<div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>	
			{ auth.currentUser && report !== null ?
			<div> 
				<h1>Site Reports</h1>
				<p> There are currently {report?.length} sites in the database. </p>
				<ul style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1em"}}>
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
			: <h1>Loading...</h1> }
		</div>
	);

}