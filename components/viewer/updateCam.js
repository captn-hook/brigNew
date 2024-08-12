import { Vector3 } from 'three';
import { views } from './siteChange';
import { state } from './viewer';

export var cameraTargPos = new Vector3(5, 5, 5);
export var cameraTargView = new Vector3(0, 0, 0);

export function setTargPos(vec) {
    cameraTargPos = vec;
}

export function updateCam(props) {


    //console.log(props.leftPanel.camFree, props.leftPanel.looking, props.leftPanel.spreadsheet, props.leftPanel.n, props.leftPanel.gi)

    if (props.leftPanel.camFree && props.leftPanel.spreadsheet == state[0]) {
        try {
            //fail quietly if cannot set camera
            if (props.leftPanel.mt == 0) {

                //console.log('failed to set camera');

            } else if (props.leftPanel.mt == 2) {
                //if y (row) == 1, ts

                cameraTargPos = new Vector3(parseFloat(props.ts[props.leftPanel.n].pos.x) + 14, parseFloat(props.ts[props.leftPanel.n].pos.z) + 30, parseFloat(props.ts[props.leftPanel.n].pos.y) + 8);
                cameraTargView = new Vector3(parseFloat(props.ts[props.leftPanel.n].pos.x), parseFloat(props.ts[props.leftPanel.n].pos.z), parseFloat(props.ts[props.leftPanel.n].pos.y));
                //console.log('set camera to t ' + props.leftPanel.n)
                //throws errors if it trys to select row before/after last
            } else if (props.leftPanel.mt == 1) {
                //if x (column) == 1, ms
                //special views
                //console.log(views[props.leftPanel.n + 1])
                if (views[props.leftPanel.n + 1] != null && views[props.leftPanel.n + 1][0] != '') {
                    cameraTargPos = new Vector3(parseFloat(views[props.leftPanel.n + 1][0]), parseFloat(views[props.leftPanel.n + 1][1]), parseFloat(views[props.leftPanel.n + 1][2]));
                } else {

                    cameraTargPos = new Vector3(parseFloat(props.ms[props.leftPanel.n].pos.x) + 7, parseFloat(props.ms[props.leftPanel.n].pos.z) + 15, parseFloat(props.ms[props.leftPanel.n].pos.y) + 5);

                }
                cameraTargView = new Vector3(parseFloat(props.ms[props.leftPanel.n].pos.x), parseFloat(props.ms[props.leftPanel.n].pos.z), parseFloat(props.ms[props.leftPanel.n].pos.y));
                //console.log('set camera to m ' + props.leftPanel.n)
                //insights
                // if (props.leftPanel.spreadsheet) {
                //     textbox.value = (insights[props.leftPanel.n + 2] == null) ? '' : decodeURI(insights[props.leftPanel.n + 2]).replaceAll('~', ',');
                //     if (textbox.value == '') {
                //         textbox.style.display = 'none';
                //     } else {
                //         textbox.style.display = 'block';
                //     }
                // } else {

                //     textbox.value = (props.leftPanel.text == null) ? '' : decodeURI(props.leftPanel.text).replaceAll('~', ',');
                //     if (textbox.value == '') {
                //         textbox.style.display = 'none';
                //     } else {
                //         textbox.style.display = 'block';
                //     }
                // }


            } else {
                //console.log('failed to set camera 2');
            }

        } catch (e) {
            //console.log(e)
        }
    } else if (props.leftPanel.spreadsheet == state[1] && props.leftPanel.camFree) {

        if (props.leftPanel.gi) {
            var i = props.leftPanel.gi;
        } else {
            var i = 0;
        }
        try {
            cameraTargPos = new Vector3(props.leftPanel.groups[i]['pos'][0] + 2, props.leftPanel.groups[i]['pos'][2] + 5, props.leftPanel.groups[i]['pos'][1] + 1);
            cameraTargView = new Vector3(props.leftPanel.groups[i]['pos'][0], props.leftPanel.groups[i]['pos'][2], props.leftPanel.groups[i]['pos'][1]);
            //console.log('set camera to g ' + i)
        } catch (e) { 
            //console.log(e)
        }

        //console.log(cameraTargPos, cameraTargView)

    } else if (props.leftPanel.spreadsheet == state[2] && props.leftPanel.camFree) {

        if (props.leftPanel.ai) {
            var i = props.leftPanel.ai;
        } else {
            var i = 0;
        }
        try {
            cameraTargPos = new Vector3(props.leftPanel.areas[i].avgPos()[0] + 2, props.leftPanel.areas[i].avgPos()[2] + 5, props.leftPanel.areas[i].avgPos()[1] + 1);
            cameraTargView = new Vector3(props.leftPanel.areas[i].avgPos()[0], props.leftPanel.areas[i].avgPos()[2], props.leftPanel.areas[i].avgPos()[1]);
            //console.log('set camera to a ' + i)
        } catch (e) {
            //console.log(e)
        }
    }
}