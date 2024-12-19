import { Vector3 } from 'three';

import { camera, state } from './viewer';

import {
    updateCam,
    setTargPos
} from './updateCam';

import dropdListener from './dropdListener';

export default function interpHash(props) {

    if (!props.leftPanel.dropd) {
        // probably not signed in
        throw new Error('No Auth');
    }
    var hash = props.window.location.hash.substring(1)

    if (hash[0] != '&') {
        var params = hash.split('&');

        if (params[0] != props.leftPanel.siteheader && params[0][0] != 'X' && params[0][0] != 'P' && params[0][0] != 'G') {
            props.leftPanel.siteheader = params[0];
            props.leftPanel.dropd.value = params[0];
            dropdListener(null, props);
        }

        if (params[1] && params[1][0] == 'G') {

            props.leftPanel.spreadsheet = state[1];
            if (params[0] != props.leftPanel.siteheader) {
                stupid = params[1].substring(2); //==========
            } else {
                props.leftPanel.gi = params[1].substring(2);
                props.screenSizes.updateSizes(props);
            }


        } else if (params[1] && params[1][0] == 'X') {
            props.leftPanel.spreadsheet = state[0];
            if (params[1].substring(2) != props.leftPanel.cellX || params[2].substring(2) != props.leftPanel.cellY) {
                props.leftPanel.firstClickX = params[0].substring(2);
                props.leftPanel.firstClickY = params[1].substring(2);
                updateCam(props);

                //props.leftPanel.canvas.dispatchEvent(new Event('click'));
            }
        } else if (params[1] && params[1][0] == 'P') {

            var coords = params[1].substring(2).split('/')

            var pos = new Vector3(parseFloat(coords[0]), parseFloat(coords[1]), parseFloat(coords[2]))
            //var rot = new Vector3(parseFloat(coords[3]), parseFloat(coords[4]), parseFloat(coords[5]))

            //                                   min dist
            if (camera.position.distanceTo(pos) > .03) {

                //console.log('moving camera');
                // if (props.leftPanel.camFree) {
                //    props.leftPanel.looking = true;
                //}

                setTargPos(pos);
                camera.rotation.set(parseFloat(params[3]), parseFloat(params[4]), parseFloat(params[5]))

                if (props.leftPanel && props.leftPanel.controls) {
                    props.leftPanel.controls.update();
                }
                updateCam(props);

            }

        }
    }
    //set font size with shortest of ms and ds
    // let lengthms = ms.length;
    // let lengthds = ts.length;
    // props.leftPanel.setFontsize(Math.min(lengthms, lengthds));

}