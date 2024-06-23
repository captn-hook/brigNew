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

    const [isTableHovered, setIsTableHovered] = useState(false);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (sites == null) {
        return <div>No sites found</div>;
    } else {
        return (
            <div style={{ marginTop: "1rem" }}>
                <Table aria-label="Sites"
                          onMouseEnter={() => setIsTableHovered(true)}
                          onMouseLeave={() => setIsTableHovered(false)}>
                    <TableHeader aria-label="Site List Header">
                        <TableColumn style={ isTableHovered ?
                            { fontSize: "1em", padding: "0.2em", paddingLeft: "0.5em", transition: "all 0.15s ease-out" } :
                            { fontSize: "2em", padding: "0.7em", paddingLeft: "0.4em", transition: "all 0.15s ease-in" }}
                        >{ selectedSite ? selectedSite : "Select Site" }</TableColumn>
                    </TableHeader>
                    <TableBody aria-label="Site List" 
                        style={ isTableHovered ? 
                            { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", maxHeight: "20em", opacity: 1, transition: "all 0.2s ease-out" } :
                            { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", maxHeight: "3em", opacity: 0.5, overflowY: "hidden", transition: "all 0.2s ease-in" }}>
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