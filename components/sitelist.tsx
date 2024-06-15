"use client";
import { useEffect, useState } from "react";
import { userSites, auth } from "./auth";
import { useTheme } from "next-themes";

import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";

export const SiteList = ( { SiteSelectListener }: { SiteSelectListener: (site: string) => void } ) => {
    const [sites, setSites] = useState<string[] | null>(null);
    const [loading, setLoading] = useState(true);
	const { theme, setTheme } = useTheme();

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

    const [selectedSite, setSelectedSite] = useState<string | null>(null);
    
    const SiteSelectListenerW = (site: string) => {
        setSelectedSite(site);
        SiteSelectListener(site);
    }

    const setColor = (theme: any) => {
        if (theme === "dark") {
            return "#333";
        } else {
            return "#f5f5f5";
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (sites == null) {
        return <div>No sites found</div>;
    } else {
        return (
            <div style={{ marginTop: "1rem" }}>
                <Table aria-label="Sites">
                    <TableHeader aria-label="Site List Header">
                        <TableColumn>Site Name</TableColumn>
                    </TableHeader>
                    <TableBody aria-label="Site List">
                        {sites.map((site, index) => (
                            <TableRow key={index}>
                                <TableCell 
                                    onClick={() => SiteSelectListenerW(site)}
                                    style={{ cursor: "pointer", 
                                              backgroundColor: site === selectedSite ? setColor(theme) : "transparent" }}
                                              aria-label={`Select site ${site}`}    >
                                    {site}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }
}