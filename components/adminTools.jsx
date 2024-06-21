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
                });
                
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
                console.log(error);
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

        // for every site, if no firestoreUsers and no storageUsers, remove it from the report
        let rm = [];
        for (let site of siteReports) {
            if (site.firestoreUsers.length == 0 && site.storageUsers.length == 0) {
                rm.push(site);
            }
        }
        for (let r of rm) {
            siteReports.splice(siteReports.indexOf(r), 1);
        }

        // now we have to fix the discrepancy between storageUsers and firestoreUsers, firestore > storage

        // for every site, if a user has access in storage but not in firestore, set the files metadata to null
        
        for (let site of siteReports) {
            for (let user of site.storageUsers) {
                if (!site.firestoreUsers.includes(user)) {
                    // set the customMedata email key to null
                    const siteRef = ref(storage, '/Sites/' + site.name + '/' + site.name + '.glb');
                    console.log('siteRef: ', siteRef, 'user: ', user);
                    let email = user.email;
                    updateMetadata(siteRef, { customMetadata: { [email]: null } }).then(() => {
                        console.log('metadata updated');
                    }).catch((error) => {
                        console.log('updateMetadata error: ', error);
                    });
                } 
            }
        }              

         
        resolve(siteReports);
    });
}

