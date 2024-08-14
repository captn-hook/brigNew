'use client';
import React from 'react';
import styles from './upload.module.css';
import { uploadFile, uploadToStorage } from '../viewer/Data';

export default function Upload() {

    let named = '';

    const [filelist, setFilelist] = React.useState([]);

    function valid() {
        // need a csv and a glb
        let csv = false;
        let glb = false;
        for (let i = 0; i < filelist.length; i++) {
            let file = filelist[i];
            if (file.name.split('.').pop() === 'csv' || file.name.split('.').pop() === 'tsv') {
                csv = true;
            }
            if (file.name.split('.').pop() === 'glb') {
                glb = true;
            }
        }
        return csv && glb && filelist.length === 2;
    }

    return (
        <div className={styles.upload}>
            <p>Upload a data file (formatted csv or tsv) and a 3D model file (glb) to create a new site</p>
            <input type="file" id="file" name="file" accept=".glb, .csv, .tsv" multiple
                onChange={(e) => {
                    const newFiles = Array.from(e.target.files);
                    while (filelist.length > 1) {
                        filelist.pop();
                    }
                    setFilelist((prevFilelist) => [...prevFilelist, ...newFiles]);
                }} />
            <ul id="fileList">
                {filelist.map((file, i) => {
                    return <li key={i}>{file.name}</li>
                })}
            </ul>
            <button style={{ backgroundColor: valid() ? 'green' : 'red', pointerEvents: valid() ? 'auto' : 'none' }}
             onClick={async () => {

                // get the name of new site
                named = prompt('Name of new site?');
                
                // get the files in the correct order
                let glb = filelist.find(file => file.name.split('.').pop() === 'glb');
                let csv = filelist.find(file => file.name.split('.').pop() === 'csv' || file.name.split('.').pop() === 'tsv');

                // upload glb
                uploadToStorage(glb, named).
                    then((res) => {
                        //upload csv
                        uploadFile(csv, named).
                            then((res) => {
                                            
                                // transfer to editor page
                                window.location.href = '/editor#' + named;
                            });
                    });
                    
            }}>Load</button>
        </div>
    )
}