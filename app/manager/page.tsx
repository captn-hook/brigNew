"use client";
import { title } from "@/components/primitives";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";

export default function ManagerPage() {
	
	const sitelist = [
		{
			"sitename": "Site 1",
			"siteX": 13,
			"siteY": 24
		},
		{
			"sitename": "Site 2",
			"siteX": 13,
			"siteY": 24
		},
		{
			"sitename": "Site 3",
			"siteX": 13,
			"siteY": 24
		},
		{
			"sitename": "Site 4",
			"siteX": 13,
			"siteY": 24
		},
		{
			"sitename": "Site 5",
			"siteX": 13,
			"siteY": 24
		},
		{
			"sitename": "Site 6",
			"siteX": 13,
			"siteY": 24
		},
		{
			"sitename": "Site 7",
			"siteX": 13,
			"siteY": 24
		},
		{
			"sitename": "Site 8",
			"siteX": 13,
			"siteY": 24
		},
		{
			"sitename": "Site 9",
			"siteX": 13,
			"siteY": 24
		},
		{
			"sitename": "Site 10",
			"siteX": 13,
			"siteY": 24
		}
	];

	return (
		<div>
			<h1 className={title()}>Site Manager</h1>
			<Table>
				<TableHeader>
					<TableColumn>Site Name</TableColumn>
					<TableColumn>Site X</TableColumn>
					<TableColumn>Site Y</TableColumn>
				</TableHeader>
				<TableBody>
					{sitelist.map((site, index) => (
						<TableRow key={index}>
							<TableCell>{site.sitename}</TableCell>
							<TableCell>{site.siteX}</TableCell>
							<TableCell>{site.siteY}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
