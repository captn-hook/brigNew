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
    Data,
    RemoteData,
    GetGroups,
    GetAreas,
} from './Data';

import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';

import {
    getBlobe
} from '../auth';

import {
    Area
} from './Area';
import exp from 'constants';

export var insights = []
export var views = []

export var workingArea = new Area([]);

export function resetWorkingArea() {
    workingArea = new Area([]);
}

export const state = {
    0: 'spreadsheet',
    1: 'groups',
    2: 'areas'
}

export const defaultDropd = 'Select a site';
export var textbox;
// three Scene
export var renderer; //seperate the renderer from the data  and data display
export const camera = new PerspectiveCamera(75, 1 / 1, 1, 500);

export var scene;
export var controls;

export function siteList(props) { //AHHH
    //empty dropdown
    while (props.leftPanel.dropd.options.length > 0) {
        props.leftPanel.dropd.remove(0);
    }
    //console.log(s);
    //add default option
    var def = document.createElement('option');
    def.text = props.leftPanel.siteheader == '' ? defaultDropd : props.leftPanel.siteheader;
    props.leftPanel.dropd.add(def);

    props.sitelist.forEach((site) => {
        var option = document.createElement('option');
        option.text = site;
        props.leftPanel.dropd.add(option);

        if (props.window && props.window.location.hash != '' && props.window.location.hash[1] != '&') {
            if (props.window.location.hash.split('&')[0].substring(1) == props.leftPanel.dropd.options[props.leftPanel.dropd.length - 1].text) {
                props.leftPanel.dropd.selectedIndex = props.leftPanel.dropd.length - 1;
            }
        }
    })

}

function refill(arr, data) {
    arr.length = 0;
    data.forEach((d) => {
        arr.push(d);
    })
}

export function dropdListener(event, props) {
    let lists = [props.ms, props.ts, props.tracers, insights, views]
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

function loadSite(targ, props, db) {
    // .glb, load model

    //var dataRef = ref(storage, '/Sites/' + event.target.value + '/data.csv');
    //loadRefs(modelRef, dataRef)
    props.leftPanel.groups = GetGroups(db, targ);
    props.leftPanel.areas = GetAreas(db, targ);

    props.leftPanel.siteheader = targ;
}

function loadRefAndDoc(ref, doc, props, db) {
    //console.log('loading ref and doc');
    getBlobe(ref)
        .then((blob) => {
            import('../viewer/modelHandler.js').then((module) => {
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

        var ms = [];
        var ts = [];
        var tracers = [];

        [ms, ts, tracers, insights, views] = data;

        refill(props.ms, ms);
        refill(props.ts, ts);
        refill(props.tracers, tracers);


        if (stupid != null) {
            props.leftPanel.gi = stupid;
            stupid = null;
        }

        props.screenSizes.updateSizes(props);

    }).catch((err) => {
        //console.error(err);
    })


}

function loadRefs(ref1, ref2, props) {

    getBlobe(ref1)
        .then((blob) => {
            import('../viewer/modelHandler.js').then((module) => {
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
        //console.log('loaded');
        var ms = [];
        var ts = [];
        var tracers = [];

        [ms, ts, tracers, insights, views] = Data(read.result)

        refill(props.ms, ms);
        refill(props.ts, ts);
        refill(props.tracers, tracers);

        //props.leftPanel.setTracers(props.ms, props.ts, props.tracers)
        // //resize sheet if sizes isnt undefined
        props.screenSizes.updateSizes(props);

    }
}

export function setTracer(tracers2) {
    props.tracers = tracers2;
}

export function reloadPanel(bool = undefined) {
    //if undefined, do nothing, if true new M, if false new T
    //props.leftPanel.setTracers(props.ms, props.ts, props.tracers)
    //select if new 
    if (bool != undefined) {
        props.leftPanel.blankClicks();
        if (bool) {
            props.leftPanel.selectLastY();
        } else {
            props.leftPanel.selectLastX();
        }
    }

    //resize sheet if props.screenSizes isnt undefined
    if (props.screenSizes != undefined) {
        props.screenSizes.updateSizes(props);
    }
}

export function windowResizeFunc(props) {
    props.screenSizes.updateSizes(props);

    // Update camera
    camera.aspect = props.screenSizes.width / props.screenSizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(props.screenSizes.width, props.screenSizes.height);
    renderer.setPixelRatio(Math.min(props.window.devicePixelRatio, 2));
}

// // FLAG ++++++++++++++++++++++++++ FLAG ++++++++++++++++++++++++++ FLAG +++++++++++++++++++++++++ FLAG +++++++++++++++++
// const bug1 = document.getElementById('bug1');
// const bug2 = document.getElementById('bug2');
// const bug3 = document.getElementById('bug3');

export function groupButtonListener(props) {
    props.leftPanel.next();

    if (props.leftPanel.spreadsheet == state[0]) {
        //if saved tracers exist, turn them on 
        //display tracers
        e.target.innerHTML = 'Groups'; //button indicates next state
        bug1.style.display = 'grid'
        bug2.style.display = 'none'
        bug3.style.display = 'none'
        //props.screenSizes.spreadsheetDiv.style.overflow = 'hidden';
    } else if (props.leftPanel.spreadsheet == state[1]) {
        //display groups
        e.target.innerHTML = 'Areas'; //button indicates next state
        bug1.style.display = 'none'
        bug2.style.display = 'grid'
        bug3.style.display = 'none'
        //props.screenSizes.spreadsheetDiv.style.overflow = 'auto';
    } else if (props.leftPanel.spreadsheet == state[2]) {
        //display areas
        e.target.innerHTML = 'Tracers'; //button indicates next state
        bug1.style.display = 'none'
        bug2.style.display = 'none'
        bug3.style.display = 'grid'
        //props.screenSizes.spreadshetDiv.style.overflow = 'auto';
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

export var cameraTargPos = new Vector3(5, 5, 5);
export var cameraTargView = new Vector3(0, 0, 0);

export var stupid = null;

export function updateCam(props) {
    let size = Math.round(Math.sqrt(props.tracers.length) / 10)
    let xadd = 3 + size;
    let zadd = 5 + size;
    let yadd = 1 + size;

    //console.log(props.leftPanel.camFree, props.leftPanel.looking, props.leftPanel.spreadsheet, props.leftPanel.n, props.leftPanel.gi)

    if (props.leftPanel.camFree && props.leftPanel.spreadsheet == state[0]) {
        try {

            //fail quietly if cannot set camera
            if (props.leftPanel.mt == 0) {

            } else if (props.leftPanel.mt == 2) {
                //if y (row) == 1, tsx
                
                cameraTargPos = new Vector3(parseFloat(props.ts[props.leftPanel.n].pos.x) + xadd, parseFloat(props.ts[props.leftPanel.n].pos.z) + zadd, parseFloat(props.ts[props.leftPanel.n].pos.y) + yadd);
                cameraTargView = new Vector3(parseFloat(props.ts[props.leftPanel.n].pos.x), parseFloat(props.ts[props.leftPanel.n].pos.z), parseFloat(props.ts[props.leftPanel.n].pos.y));

                //throws errors if it trys to select row before/after last
            } else if (props.leftPanel.mt == 1) {
                //if x (column) == 1, ms
                //special views
                //console.log(views[props.leftPanel.n + 1])
                if (views[props.leftPanel.n + 1] != null && views[props.leftPanel.n + 1][0] != '') {
                    cameraTargPos = new Vector3(parseFloat(views[props.leftPanel.n + 1][0]), parseFloat(views[props.leftPanel.n + 1][1]), parseFloat(views[props.leftPanel.n + 1][2]));
                } else {

                    cameraTargPos = new Vector3(parseFloat(props.ms[props.leftPanel.n].pos.x) + xadd, parseFloat(props.ms[props.leftPanel.n].pos.z) + zadd, parseFloat(props.ms[props.leftPanel.n].pos.y) + yadd);

                }
                cameraTargView = new Vector3(parseFloat(props.ms[props.leftPanel.n].pos.x), parseFloat(props.ms[props.leftPanel.n].pos.z), parseFloat(props.ms[props.leftPanel.n].pos.y));

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
            cameraTargPos = new Vector3(props.leftPanel.groups[i]['pos'][0] + xadd, props.leftPanel.groups[i]['pos'][2] + zadd, props.leftPanel.groups[i]['pos'][1] + yadd);
            cameraTargView = new Vector3(props.leftPanel.groups[i]['pos'][0], props.leftPanel.groups[i]['pos'][2], props.leftPanel.groups[i]['pos'][1]);
        } catch (e) { }

        //console.log(cameraTargPos, cameraTargView)

    } else if (props.leftPanel.spreadsheet == state[2] && props.leftPanel.camFree) {

        if (props.leftPanel.ai) {
            var i = props.leftPanel.ai;
        } else {
            var i = 0;
        }
        try {
            cameraTargPos = new Vector3(props.leftPanel.areas[i].avgPos()[0] + xadd, props.leftPanel.areas[i].avgPos()[2] + zadd, props.leftPanel.areas[i].avgPos()[1] + yadd);
            cameraTargView = new Vector3(props.leftPanel.areas[i].avgPos()[0], props.leftPanel.areas[i].avgPos()[2], props.leftPanel.areas[i].avgPos()[1]);
        } catch (e) { }
    }
}

//canvas
// document.getElementById('title').addEventListener('click', (e) => {

//     bw = !bw;

//     props.leftPanel.setbw(bw)

//     if (bw) {
//         e.target.innerHTML = 'Light Mode';
//         scene.background = new Color(0x000000);
//     } else {
//         e.target.innerHTML = 'Dark Mode';
//         scene.background = new Color(0xffffff);
//     }
// })



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

export function interpHash(props) {
    
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

                cameraTargPos = pos
                camera.rotation.set(parseFloat(params[3]), parseFloat(params[4]), parseFloat(params[5]))

                controls.update();
                updateCam(props);

            }

        }
    }
    //set font size with shortest of ms and ds
    // let lengthms = ms.length;
    // let lengthds = ts.length;
    // props.leftPanel.setFontsize(Math.min(lengthms, lengthds));

}

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


    props.leftPanel.ms = props.ms;
    props.leftPanel.ts = props.ts;
    props.leftPanel.tracers = props.tracers;

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