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
    props.setLoading(true);
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

        if (!props.window) {
            console.log("window not defined");
            return;
        }

        if (targ != defaultDropd) {
            props.window.location.hash = targ + '&';
            loadSite(targ, props, db);

            var modelRef = '/Sites/' + targ + '/' + targ + '.glb';

            loadRefAndDoc(modelRef, targ, props, db);
        } else {
            //load default
            props.window.location.hash = defaultDropd + '&';

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

            if (props.setProps != null) {
                props.setProps(props);
            }
        }

    });

    //props.window.location.hash = props.leftPanel.siteheader + '&';
}
