import { useState, useEffect, useCallback } from "react";

import { functions } from "./auth";

import {
    getSiteUsers,
    removeUser,
    addUser
} from "./adminTools";

import { SiteList } from "@/components/sitelist";

import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";
import { Button } from '@nextui-org/button';

import {
    httpsCallable,
    //connectFunctionsEmulator
} from 'firebase/functions';    
import { user } from "@nextui-org/theme";

function AddUserForm({ users, inUsers, currentSite, callback }: { users: any[], inUsers: any[] | null, currentSite: string, callback?: () => void }) {
    // filter out users that are already in the site
    if (inUsers && inUsers.length > 0 && users) {
        users = users.filter((user) => {
            return !inUsers?.includes(user.email);
        });
    }

    return (
        <Table aria-label="Users">
            <TableHeader aria-label="Users Header">
                <TableColumn>No Access</TableColumn>
                <TableColumn> </TableColumn>
            </TableHeader>
            <TableBody aria-label="Users List" style={
                {
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    maxHeight: "200px",
                    overflowY: "scroll"
                }
            }>
                {
                    users.map((user, index) => (
                        <TableRow key={index} style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                            <TableCell key={index}>{user.email}</TableCell>
                            <TableCell><Button size="sm" onClick={() => { 
                                console.log("adding user to site: ", user.email, user.uid, currentSite);
                                addUser(currentSite, user.email, user.uid).then(() => {
                                    // refresh the lists of users
                                    if (callback) {
                                        callback();
                                    }
                                }).catch((error) => {
                                    console.error(error);
                                });
                            }}>Add</Button></TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    );
}

export default function UserList() {

    const listUsers = httpsCallable(functions, 'listUsers');

    const [users, setUsers] = useState<any[] | null>(null);

    const [currentSite, setCurrentSite] = useState<string | null>(null);

    useEffect(() => {
        listUsers().then((result: any) => {
            setUsers(result.data.users);
        }).catch((error) => {
            console.error(error);
        });
    });


    const [inUsers, setInUsers] = useState<string[] | null>(null);

    const fetchUsers = useCallback(async () => {
        if (users && currentSite) {
            setInUsers(await getSiteUsers(currentSite).catch((error) => {
                return null;
            }));
        }
    }, [users, currentSite]);

    useEffect(() => {
        if (currentSite) {
            fetchUsers();
        }
    }, [currentSite, users, fetchUsers]);

    return (
        <div>
            <SiteList SiteSelectListener={(site) => setCurrentSite(site)} />
            {currentSite && inUsers ? <div> 
                <h2>Remove User</h2>
                <Table aria-label="Permissions">
                    <TableHeader aria-label="Permissions Header">
                        <TableColumn>Access</TableColumn>
                    </TableHeader>
                    <TableBody aria-label="Permissions List">
                        {
                            inUsers && inUsers.length > 0 ? inUsers.map((user, index) => (
                                <TableRow key={index}>
                                    <TableCell>{user} <Button size="sm" onClick={() => {
                                        removeUser(currentSite, user, users?.find((u) => u.email === user)?.uid)
                                            .then(() => {
                                                fetchUsers();
                                            }).catch((error) => {
                                                console.error(error);
                                            });
                                    }}>Remove</Button></TableCell>
                                </TableRow>
                            )) : <TableRow><TableCell>No users found</TableCell></TableRow>
                        }
                    </TableBody>
                </Table>
            </div> : null}
            {currentSite && users ? <h2>Add User</h2> : null}
            {currentSite && users ? <AddUserForm users={users} inUsers={inUsers} currentSite={currentSite} callback={() => {
                console.log("user added"); // refresh our inUsers and re-render
                
                listUsers().then((result: any) => {
                    setUsers(result.data.users);
                }).catch((error) => {
                    console.error(error);
                });

                fetchUsers();                
                
            }} /> : null}
        </div>
    );
}