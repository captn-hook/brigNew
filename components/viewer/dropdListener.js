import { defaultDropd } from './siteList';

import { 
    loadSite,
    loadRefAndDoc,
    loadRefs,
} from './siteChange';

import {
    GetGroups,
    GetAreas,
} from './Data';

export default function dropdListener(event, props) {
    let lists = [props.ms, props.ts, props.tracers, props.insights, props.views]
    lists.forEach((list) => {
        for (let i = list.length - 1; i >= 0; i--) {
            list.pop();
        }
    })
    //console.log("CGANGIN", event.target.value);
    if (event == null) {
        var targ = props.leftPanel.siteheader;
    } else if (event.target.value == null || event.target.value == undefined || event.target.value == '') {
        var targ = props.leftPanel.siteheader;
    } else {
        var targ = event.target.value;
    }

    import('../auth').then((module) => {

        const db = module.db;
        //console.log("TARG", targ);

        if (targ != defaultDropd) {

            loadSite(targ, props, db);

            var modelRef = '/Sites/' + targ + '/' + targ + '.glb';

            loadRefAndDoc(modelRef, targ, props, db);
        } else {
            //load default

            /*
            load example
            */
            var modelRef = '/Example/example.glb';

            var dataRef = '/Example/data.csv';

            // .glb, load model

            loadRefs(modelRef, dataRef, props);

            props.leftPanel.groups = GetGroups(db, targ);
            props.leftPanel.areas = GetAreas(db, targ);

            /*
            Animate
            */
            props.leftPanel.siteheader = 'Example';
        }

    });

    //props.window.location.hash = props.leftPanel.siteheader + '&';
}
