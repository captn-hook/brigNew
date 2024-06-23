import { getSiteUsers } from "./userlist";

import { httpsCallable } from "firebase/functions";
import { ref, getMetadata, listAll, updateMetadata } from 'firebase/storage';
import { collection, getDocs } from "firebase/firestore";

import { storage, functions, db } from "./auth";
import exp from "constants";


export function userSitesUID(uid) {
    return new Promise(async function (resolve, reject) {
        const userSites = [];
        getDocs(collection(db, uid)).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // if access == true
                if (doc.data().access) {
                    userSites.push(doc.id);
                } 
            } );
            resolve(userSites);
        } ).catch((error) => {
            console.log('userSitesUID error: ', error);
            reject(error);
        } );
    } );
}            

export function getUsers() {
    const listUsers = httpsCallable(functions, 'listUsers');

    return new Promise(async function (resolve, reject) {
        listUsers().then((result) => {
            resolve(result.data.users);
        }).catch((error) => {
            console.log('listUsers error: ', error);
            reject(error);
        });
    });
}      

export function getSites() {
    return new Promise(async function (resolve, reject) {
        const storageRef = ref(storage, '/Sites/');
        listAll(storageRef).then((res) => {
            const siteNames = res.prefixes.map((prefix) => prefix.name);
            resolve(siteNames); 
        }).catch((error) => {
            console.log('listAll error: ', error);
            reject(error);
        });
    });
}

export default async function LemmeIn() {
    return new Promise(async function (resolve, reject) {
        
        // get all users
        const users = await getUsers()
        console.log('got all users');
        // get all sites
        //listAll to get /Sites/*
        const sites = await getSites();
        console.log('got all sites');

        // generate report frameworks
        let siteReports = [];
        for (let site of sites) {
            siteReports.push({
                name: site,
                metadata: {},
                storageUsers: [],
                firestoreUsers: []
            });
        }
        console.log('generated report frameworks for all sites');
        // does a user have access to the site in firebase storage? 
        // determined by file metadata
        for (let site of siteReports) {
            try {
                const siteRef = ref(storage, '/Sites/' + site.name + '/' + site.name + '.glb');
                let rm = [];
                const metadata = await getMetadata(siteRef).then((res) => {
                    return res;
                }).catch((error) => {
                    // remove this site from the list
                    rm.push(site);
                    return null;
                });
                if (metadata === null) {
                    continue;
                }
                
                // rm rm
                for (let r of rm) {
                    siteReports.splice(siteReports.indexOf(r), 1);
                } 

                if (metadata && metadata.customMetadata) {
                    site.metadata = metadata.customMetadata;
                } else {
                    site.metadata = {};
                }
            } catch (error) {
                //console.log(error);
                // remove this site from the list if it doesn't exist
                siteReports.splice(siteReports.indexOf(site), 1);
            }
        }
        console.log('finished checking metadata for all sites');
        // does a user have access to the site in firestore?
        // for every user get their uid collection
        let collectionInfo = [];
        for (let user of users) {
            const userSites = await userSitesUID(user.uid).then((res) => {
                collectionInfo.push({
                    uid: user.email,
                    sites: res
                });
            }).catch((error) => {
                console.log('userSitesUID error: ', error);
            });
        }
        console.log('finished checking firestore for all users');
        // fill out storageUsers according to site.metadata
        for (let site of siteReports) {
            for (let user of collectionInfo) {
                if (site.metadata[user.uid]) {
                    site.storageUsers.push(user.uid);
                }
            }
        }
        console.log('finished checking storage for all users');
        // fill out firestoreUsers according to collectionInfo
        for (let user of collectionInfo) {
            for (let site of siteReports) {
                if (user.sites.includes(site.name)) {
                    site.firestoreUsers.push(user.uid);
                }
            }
        }
        console.log('finished generating report');
        resolve(siteReports);
    });
}
