import { useState, useEffect } from "react";

import { storage, functions } from "./auth";

import {
    ref,
    getMetadata
} from 'firebase/storage';

import { SiteList } from "@/components/sitelist";

import {
    getFunctions,
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

export default function UserList() {

    const listUsers = httpsCallable(functions, 'listUsers');

    const [users, setUsers] = useState<object[] | null>(null);

    const [currentSite, setCurrentSite] = useState<string | null>(null);

    var itemRef = ref(storage, '/Sites/' + currentSite + '/' + currentSite + '.glb')

    function getSiteUsers(users: any) {
        var outUsers = users;
        var inUsers: any[] = [];
        if (currentSite != null) {
            getMetadata(itemRef).then((metadata) => {

                if (metadata.customMetadata != null) {

                    var names = Object.keys(metadata.customMetadata);
                    var data = Object.values(metadata.customMetadata);

                    names.forEach((user: any) => {

                        if (data[names.indexOf(user)] != 'false') {
                            inUsers.push(user.email);
                        } else {
                            console.log(user.email + " is not in " + currentSite);
                        }
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            })
        }
        console.log(inUsers);
        return inUsers;
    }


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
        setInUsers(getSiteUsers(users));
    }, [currentSite]);

    return (
        <div>
            <SiteList SiteSelectListener={(site) => setCurrentSite(site)} />
            <h1>Users</h1>
            <ul>
                {users?.map((user, index) => ( 
                    <User key={index} user={user} in={ inUsers ? inUsers.includes(user.uid) : false } />
                ))}
            </ul>
        </div>
    );
}