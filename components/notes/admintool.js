
        // // for every site, if a user has access in storage but not in firestore, set the files metadata to null
        // let newMetadata = {}; // key: site name, value: new metadata
        // // make sure to limit the number of updates by batching them all, including setting firestoreUsers storage access to true
        // for (let site of siteReports) {
        //     for (let user of site.storageUsers) {
        //         let newMeta = site.metadata;
        //         if (!site.firestoreUsers.includes(user)) {
        //             newMeta[user] = null;
        //         } else {
        //             newMeta[user] = true;
        //         }
        //         newMetadata[site.name] = newMeta;
        //     }
        // }
        // // update the metadata
        // for (let site of siteReports) {
        //     if (newMetadata[site.name]) {
        //         const siteRef = ref(storage, '/Sites/' + site.name + '/' + site.name + '.glb');
        //         await updateMetadata(siteRef, {customMetadata: newMetadata[site.name]}).then(() => {
        //             console.log('Metadata updated for ' + site.name);
        //         }).catch((error) => {
        //             console.log('updateMetadata error: ', error);
        //         });
        //     }
        // }
        
        // // for every site, if no firestoreUsers and no storageUsers, remove it from the report
        // let rm = [];
        // for (let site of siteReports) {
        //     if (site.firestoreUsers.length == 0 && site.storageUsers.length == 0) {
        //         rm.push(site);
        //     }
        // }
        // for (let r of rm) {
        //     siteReports.splice(siteReports.indexOf(r), 1);
        // }

        // // now we have to fix the discrepancy between storageUsers and firestoreUsers, firestore > storage
        // for (let site of siteReports) {
        //     let new_metadata = {};
        //     for (let user of site.firestoreUsers) {
        //         new_metadata[user] = true;
        //     }
        //     //update metadata if it is different from new_metadata
        //     if (JSON.stringify(site.metadata) !== JSON.stringify(new_metadata)) {
        //         const siteRef = ref(storage, '/Sites/' + site.name + '/' + site.name + '.glb');
        //         await updateMetadata(siteRef, {customMetadata: new_metadata}).then(() => {
        //             console.log('Metadata updated for ' + site.name);
        //         }).catch((error) => {
        //             console.log('updateMetadata error: ', error);
        //         });
        //     }
        // }

 // for every site, give tristanskyhook@gmail.com firestore access
 for (let site of siteReports) {
        if (!site.firestoreUsers.includes('tristanskyhook@gmail.com')) {
            setDoc(doc(db, 'WqkeGuRlDebTAWfMgR9mjYIUF4S2', site.name), {
                'access': true,
            });
        }
    }