import { useState, useEffect } from "react";

import { storage, functions } from "./auth";

import {
    ref,
    getMetadata
} from 'firebase/storage';

import { SiteList } from "@/components/sitelist";

import {
    httpsCallable,
    //connectFunctionsEmulator
} from 'firebase/functions';

function User({ user, in: inSite }: { user: any, in: boolean }) {
    return (
        <li style={{ color: inSite ? 'green' : 'red' }}>
            {user.email}
        </li>
    );
}

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
            <h1>Users</h1>
            <ul>
                {
                    currentSite ? users?.map((user, index) => (
                        <User
                            key={index} 
                            user={user} 
                            in={ inUsers ? inUsers.includes(user.email) : false } />
                    )) : <div>No site selected</div>
                }
            </ul>
        </div>
    );
}