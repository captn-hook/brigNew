
import {
    Data,
    RemoteData,
    GetGroups,
    GetAreas,
} from './Data.js';

import {
    getBlobe
} from '../auth.tsx';

import { scene } from './viewer.js';

export var insights = []
export var views = []

export function refill(arr, data) {
    arr.length = 0;
    data.forEach((d) => {
        arr.push(d);
    })
}

export function refillAll(props, data) {
    var ms = [];
    var ts = [];
    var tracers = [];
    var insights = [];
    var views = [];

    [ms, ts, tracers, insights, views] = data;

    refill(props.ms, ms);
    refill(props.ts, ts);
    refill(props.tracers, tracers);
    refill(props.insights, insights);
    refill(props.views, views);

    props.screenSizes.updateSizes(props);

}

export function loadSite(targ, props, db) {
    // .glb, load model

    //var dataRef = ref(storage, '/Sites/' + event.target.value + '/data.csv');
    //loadRefs(modelRef, dataRef)
    props.leftPanel.groups = GetGroups(db, targ);
    props.leftPanel.areas = GetAreas(db, targ);

    props.leftPanel.siteheader = targ;
}

export function loadRefAndDoc(ref, doc, props, db) {
    console.log('loading ref and doc');
    getBlobe(ref)
        .then((blob) => {
            import('./modelHandler.js').then((module) => {
                console.log('model transfered, loading...');
                module.handleModels(blob, scene);
            })
        })
        .catch((err) => {
            console.error('transfer error...');
            console.error(err);
        })

    RemoteData(db, doc).then((data) => {
        console.log('data transfered, loading...');

        refillAll(props, data);

        if (stupid != null) {
            props.leftPanel.gi = stupid;
            stupid = null;
        }

        props.screenSizes.updateSizes(props);

    }).catch((err) => {
        //console.error(err);
    })


}

export function loadRefs(ref1, ref2, props) {

    getBlobe(ref1)
        .then((blob) => {
            import('./modelHandler.js').then((module) => {
                console.log('model transfered, loading...');
                module.handleModels(blob, scene);
            })

        })
        .catch((err) => {
            console.error('transfer error...');
            console.error(err);
        })

    // .csv, load data

    getBlobe(ref2)
        .then((blob) => {
            handleFiles(blob, props);
        })
        .catch((err) => {
            console.error('No Data', err);
        })

}

export function handleFiles(input, props) {

    //remove old stuff first

    props.leftPanel.blankClicks();

    var read = new FileReader();


    read.readAsBinaryString(input);

    read.onloadend = function () {
        console.log('loaded');
        
        refillAll(props, Data(read.result));

        //props.leftPanel.setTracers(props.ms, props.ts, props.tracers)
        // //resize sheet if sizes isnt undefined
        props.screenSizes.updateSizes(props);

    }
}
