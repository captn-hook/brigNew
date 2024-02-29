"use client";
import { useEffect, useState } from "react";
import { userSites, auth } from "./auth";

import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";

export const SiteList = () => {
    const [sites, setSites] = useState<string[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                userSites().then((sites) => {
                    setSites(sites as string[]);
                    setLoading(false);
                }).catch((error) => {
                    console.error(error);
                    setLoading(false);
                });
            } else {
                setLoading(false);
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (sites == null) {
        return <div>No sites found</div>;
    } else {
        return (
            <div style={{ marginTop: "1rem" }}>
                <Table>
                    <TableHeader>
                        <TableColumn>Site Name</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {sites.map((site, index) => (
                            <TableRow key={index}>
                                <TableCell>{site}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }
}