import { Color } from 'three';

import {
    camera,
    renderer,
    scene
} from './viewer.js';

export function windowResizeFunc(props) {
    props.screenSizes.updateSizes(props);

    // Update camera
    camera.aspect = props.screenSizes.width / props.screenSizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    if (renderer != undefined) {
        renderer.setSize(props.screenSizes.width, props.screenSizes.height);
        renderer.setPixelRatio(Math.min(props.window.devicePixelRatio, 2));
    }
}

export function changeSceneBG(props) {
    if (scene != undefined) {
        scene.background = props.bools[6] ? new Color(0x000000) : new Color(0xffffff);
    }
}
// console.log('updating sizes from groups');
// props.screenSizes.updateSizes(leftPanel);

export function stoplookin(props) {
    if (props.leftPanel.camFree) {
        props.leftPanel.looking = false;
    }
}

export function storePos(props) {
    //store pos in link
    var pos = String('P=' + Math.round(camera.position.x * 100) / 100) + '/' + String(Math.round(camera.position.y * 100) / 100) + '/' + String(Math.round(camera.position.z * 100) / 100) + '/' + String(Math.round(camera.rotation.x * 100) / 100) + '/' + String(Math.round(camera.rotation.y * 100) / 100) + '/' + String(Math.round(camera.rotation.z * 100) / 100)

    if (pos[0] != null) {
        props.window.location.hash = props.leftPanel.siteheader + '&' + pos;
    }
}


// textbox.addEventListener('input', e => {
//     if (textbox.readOnly == false) {
//         if (props.leftPanel.spreadsheet == state[0]) {
//             insights[props.leftPanel.firstClickY] = encodeURI(textbox.value.replaceAll(/,/g, '~'));
//         } else {
//             props.leftPanel.text = encodeURI(textbox.value.replaceAll(/,/g, '~'))
//             //console.log(props.leftPanel.text);
//         }
//     }
// })
