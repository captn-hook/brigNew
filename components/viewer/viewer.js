import {
    PerspectiveCamera,
    Vector3,
    WebGLRenderer,
    Color,
    AmbientLight,
    Scene,
    Clock
} from 'three';

import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';

import {
    Area
} from './Area';

import {
    loadRefs
} from './siteChange';

import {
    windowResizeFunc
} from './listeners';

import interpHash from './interpHash';

import { 
    cameraTargPos, 
    cameraTargView, 
    updateCam 
} from './updateCam';

export var workingArea = new Area([]);

export function resetWorkingArea() {
    workingArea = new Area([]);
}

export const state = {
    0: 'spreadsheet',
    1: 'groups',
    2: 'areas'
}

export var textbox;
// three Scene
export var renderer; //seperate the renderer from the data  and data display
export const camera = new PerspectiveCamera(75, 1 / 1, 1, 500);

export var scene;
export var controls;

export var stupid = null;

export function open(props) {
    //prop bools
    let pb = {
        val: props.bools[0],
        opac: props.bools[1],
        flip: props.bools[2],
        cam: props.bools[3],
        reset: props.bools[4],
        tog: props.bools[5],
        theme: props.bools[6]

    }
    //console.log('viewer open', props);
    // props.screenSizes.canvas2d.addEventListener('mousedown', (e) => {
    //     console.log('mousedown');
    // })
    //defaultPage();
    //console.log('viewer open', pp);
    //console.log('WITH: ', pp.params);
    // if (firebaseEnv.auth.currentUser) {
    //     import('./LoginStyle.js').then((module) => { module.default(); });
    // }
    //firebase

    const light = new AmbientLight(0xffffff, 1.3);
    if (scene == undefined) {
        scene = new Scene();
        scene.background = props.bools[6] ? new Color(0x000000) : new Color(0xffffff);
        scene.add(camera);
        scene.add(light);
    }

    camera.position.set(5, 5, 5);
    camera.lookAt(new Vector3(0, 0, 0));

    var lastgi = -1;
    var lastai = -1;

    //sizes = new ScreenSizes();
    // Lights

    // Canvassesses
    // FLAG ++++++++++++++++++++++++++ FLAG ++++++++++++++++++++++++++ FLAG +++++++++++++++++++++++++ FLAG +++++++++++++++++
    const canvas3d = props.screenSizes.webgl;
    const canvas2d = props.screenSizes.canvas2d; //tracers

    controls = null;
    controls = new OrbitControls(camera, canvas2d);

    renderer = new WebGLRenderer({
        canvas: canvas3d
    });


    renderer.setSize(props.screenSizes.width, props.screenSizes.height);
    renderer.setPixelRatio(Math.min(props.window.devicePixelRatio, 2));

    const clock = new Clock();


    //elements    


    //popstate check if props.leftPanel has lost data

    //resize
    // FLAG ++++++++++++++++++++++++++ FLAG ++++++++++++++++++++++++++ FLAG +++++++++++++++++++++++++ FLAG +++++++++++++++++
    // props.window.addEventListener('resize', () => {
    //     // Update props.screenSizes
    //     windowResizeFunc(props);
    // })

    if (props.window.location.hash == '' || props.window.location.hash[1] == '&') {
        let path0 = '/Example/example.glb'
        let path1 = '/Example/data.csv'
        loadRefs(path0, path1, props);
    }

    windowResizeFunc(props);
    interpHash(props);

    const tick = () => {

        const elapsedTime = clock.getElapsedTime();
        if (props.leftPanel) {
            if (props.leftPanel.looking || props.leftPanel.state == state[1]) {
                updateCam(props);
            }


            //if camera.position isnt cameraTargPos, move camera towards point
            if (props.leftPanel.looking && camera.position.distanceTo(cameraTargPos) > .05) {
                camera.position.lerp(cameraTargPos, .03)
            } else if (props.leftPanel.looking && controls && controls.target.distanceTo(cameraTargView) < .05) {
                props.leftPanel.looking = false;
            }

            //if controls.target isnt cameraTargView, turn camera towards point
            if (props.leftPanel.looking && controls && controls.target.distanceTo(cameraTargView) > .05) {
                controls.target.lerp(cameraTargView, .03)
            } else if (props.leftPanel.looking && camera.position.distanceTo(cameraTargPos) < .05) {
                props.leftPanel.looking = false;
            }
        }
        // Update Orbital Controls

        if (controls) {
            controls.update();
        }
        // Render
        renderer.render(scene, camera);

        //New Frame
        props.screenSizes.clearC2d();
        if (props.leftPanel & props.leftPanel.ctx != undefined) {
            props.leftPanel.ctx.clearRect(0, 0, props.leftPanel.canvas.width, props.leftPanel.canvas.height);
        }
        //Tracers
        if (props.leftPanel.spreadsheet != state[2]) {
            props.tracers.forEach(t => t.drawTracer(props.leftPanel, camera, props.screenSizes, props.bools[1], props.bools[0]));

            //Points
            props.ms.forEach(pt => pt.drawPt(props.leftPanel, camera, props.screenSizes, props.bools[6]));
            props.ts.forEach(pt => pt.drawPt(props.leftPanel, camera, props.screenSizes, props.bools[6]));
        }

        if (props.leftPanel != undefined & props.leftPanel.canvas != undefined) {
            if (props.bools[6]) {
                props.leftPanel.ctx.fillStyle = 'black';
            } else {
                props.leftPanel.ctx.fillStyle = 'white';
            }

            props.leftPanel.frame();
        }
        //values
        if (props.bools[0] && props.leftPanel.spreadsheet == state[0]) {
            props.tracers.forEach(t => t.drawValues(props.leftPanel));
        }


        if (props.leftPanel && props.leftPanel.spreadsheet == state[1] && props.leftPanel.gi) {
            if (props.leftPanel.gi != lastgi) {
                lastgi = props.leftPanel.gi;

                props.ms.forEach(pt => pt.visible = false);
                props.ts.forEach(pt => pt.visible = false);
                props.tracers.forEach((t) => {
                    var label = String(t.m.i) + "/" + String(t.t.i);

                    try {
                        t.visible = props.leftPanel.groups[lastgi][label];
                    } catch (e) {
                        //console.log(props.leftPanel.groups0, lastgi, props.leftPanel.groups[lastgi], label)
                    }

                    if (t.visible) {
                        t.m.visible = true;
                        t.t.visible = true;
                    }
                })
            }
        }

        if (props.leftPanel && props.leftPanel.spreadsheet == state[2]) {

            if (props.leftPanel.ai != lastai && props.leftPanel.areas[lastai]) {
                lastai = props.leftPanel.ai;

                props.leftPanel.areas[lastai].visible = !props.leftPanel.areas[lastai].visible;
            }

            props.leftPanel.areas.forEach(a => {
                if (a != undefined) {
                    a.drawArea(camera, props.screenSizes, props.bools[0], props.bools[1]);
                }
            });
            if (workingArea) {
                workingArea.drawArea(camera, props.screenSizes, props.bools[0], true, 'last');
            }

        }

        // Call tick again on the next frame
        props.window.requestAnimationFrame(tick);
    }

    tick();
    //this never happens
    return Promise.resolve();
}

export function close() {
    return Promise.resolve();
}