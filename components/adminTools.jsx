import { getSiteUsers } from "./userlist";

import { httpsCallable } from "firebase/functions";
import { ref, getMetadata, listAll, updateMetadata } from 'firebase/storage';
import { collection, getDocs } from "firebase/firestore";

import { storage, functions, db } from "./auth";
import { use } from "react";


function userSitesUID(uid) {
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
    
export default async function LemmeIn() {
    return new Promise(async function (resolve, reject) {
        
        // get all users
        const listUsers = httpsCallable(functions, 'listUsers');
        const users = await listUsers().then((result) => {
            return result.data.users;
        }).catch((error) => {
            console.log('listUsers error: ', error);
            reject(error);
        });

        // get all sites
        //listAll to get /Sites/*
        const storageRef = ref(storage, '/Sites/');
        const sites = await listAll(storageRef).then((res) => {
            // get res.prefixes.name
            return res.prefixes.map((prefix) => {
                return prefix.name;
            });
        }).catch((error) => {
            console.log('listAll error: ', error);
            reject(error);
        });
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
            
        // fill out storageUsers according to site.metadata
        for (let site of siteReports) {
            for (let user of collectionInfo) {
                if (site.metadata[user.uid]) {
                    site.storageUsers.push(user.uid);
                }
            }
        }

        // fill out firestoreUsers according to collectionInfo
        for (let user of collectionInfo) {
            for (let site of siteReports) {
                if (user.sites.includes(site.name)) {
                    site.firestoreUsers.push(user.uid);
                }
            }
        }

        // if there are no users with either access, remove the site from the report
        siteReports = siteReports.filter(site => site.storageUsers.length > 0 || site.firestoreUsers.length > 0);
        resolve(siteReports);
    });
}

