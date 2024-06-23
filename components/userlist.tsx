import { useState, useEffect } from "react";

import { storage, functions } from "./auth";

import {
    ref,
    getMetadata
} from 'firebase/storage';

import { SiteList } from "@/components/sitelist";

import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";

import {
    httpsCallable,
    //connectFunctionsEmulator
} from 'firebase/functions';

export function getSiteUsers(currentSite: string | null) {
    var inUsers: any[] = [];
    var itemRef = ref(storage, '/Sites/' + currentSite + '/' + currentSite + '.glb')

    if (currentSite != null) {
        getMetadata(itemRef).then((metadata) => {

            if (metadata.customMetadata != null) {

                var names = Object.keys(metadata.customMetadata);
                var data = Object.values(metadata.customMetadata);

                names.forEach((user: any) => {

                    if (data[names.indexOf(user)] != 'false') {
                        inUsers.push(user);
                    } else {
                        console.log(user + " is not in " + currentSite);
                    }
                });
            }
        })
            .catch((error) => {
                console.error(error);
            })
    }
    return inUsers
}


export default function UserList() {

    const listUsers = httpsCallable(functions, 'listUsers');

    const [users, setUsers] = useState<any[] | null>(null);

    const [currentSite, setCurrentSite] = useState<string | null>(null);

    useEffect(() => {
        listUsers().then((result: any) => {
            setUsers(result.data.users);
            console.log(result.data.users);
        }).catch((error) => {
            console.error(error);
        });
    }, []);


    const [inUsers, setInUsers] = useState<string[] | null>(null);

    useEffect(() => {
        setInUsers(getSiteUsers(currentSite));
    }, [currentSite]);

    return (
        <div>
            <SiteList SiteSelectListener={(site) => setCurrentSite(site)} />
            <h1>Permissions Table</h1>
            <Table aria-label="Permissions">
                <TableHeader aria-label="Permissions Header">
                    <TableColumn>Access</TableColumn>
                </TableHeader>
                <TableBody aria-label="Permissions List">
                    {
                        inUsers && inUsers.length > 0 ? inUsers.map((user, index) => (
                            <TableRow key={index}>
                                <TableCell>{user}</TableCell>
                            </TableRow>
                        )) : <TableRow><TableCell>No users found</TableCell></TableRow>
                    }
                </TableBody>
            </Table>
        </div>
    );
}