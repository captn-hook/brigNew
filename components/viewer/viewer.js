import {
    PerspectiveCamera,
    Vector3,
    WebGLRenderer,
    Color,
    AmbientLight,
    Scene,
    Clock
} from 'three';

// import {
//     default as html
// } from './viewer.html';

import {
    Data,
    RemoteData,
    GetGroups,
    GetAreas,
} from './Data';

// import {
//     ScreenSizes
// } from './ScreenSizes';

import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';


import {
    Panel
} from './Panel';

import {
    getBlobe
} from '../auth';

// import {
//     getStorage,
//     ref,
//     getBlob,
// } from 'firebase/storage';

// import {
//     getFirestore,
// } from 'firebase/firestore';

import {
    Area
} from './Area';

// import {
//     default as defaultPage
// } from '../index/DefaultPage';

export var ms = []
export var ts = []
export var tracers = []
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

export var renderer;
export const camera = new PerspectiveCamera(75, 1 / 1, 1, 500);

// three Scene
export const defaultDropd = 'Select a site';
export var dropd;
export var textbox;
export var camFree = false;

export function open(props) {
    //document.body.innerHTML = html;

    return cont(props);
}

export var leftPanel;
//export var sizes;
export var scene;

export function siteList(props) {
    //empty dropdown
    while (dropd.firstChild) {
        dropd.removeChild(dropd.firstChild);
    }
    //console.log(s);
    //add default option
    var def = document.createElement('option');
    def.text = defaultDropd;
    dropd.add(def);

    props.sitlist.forEach((site) => {
        var option = document.createElement('option');
        option.text = site;
        dropd.add(option);

        if (props.window.location.hash != '' && props.window.location.hash[1] != '&') {
            if (props.window.location.hash.split('&')[0].substring(1) == dropd.options[dropd.length - 1].text) {
                dropd.selectedIndex = dropd.length - 1;
            }
        }
    })

}

export function handleFiles(input, screenSizes = undefined) {

    //remove old stuff first
    leftPanel.blankClicks();

    var read = new FileReader();


    read.readAsBinaryString(input);

    read.onloadend = function () {

        [ms, ts, tracers, insights, views] = Data(read.result)

        leftPanel.setTracers(ms, ts, tracers)
        // //resize sheet if sizes isnt undefined
        if (screenSizes != undefined) {
            screenSizes.updateSizes(leftPanel);
        }
    }
}

export function setTracer(tracers2) {
    tracers = tracers2;
}

export function reloadPanel(bool = undefined) {
    //if undefined, do nothing, if true new M, if false new T
    leftPanel.setTracers(ms, ts, tracers)
    //select if new 
    if (bool != undefined) {
        leftPanel.blankClicks();
        if (bool) {
            leftPanel.selectLastY();
        } else {
            leftPanel.selectLastX();
        }
    }

    //resize sheet if props.screenSizes isnt undefined
    if (props.screenSizes != undefined) {
        props.screenSizes.updateSizes(leftPanel);
    }
}

export function cont(props) {
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
    let db, storage = import('../auth').then((module) => {
        return module.db, module.storage;
    });
    
    const light = new AmbientLight(0xffffff, 1.3);
    if (scene == undefined) {
        scene = new Scene();
        scene.background = new Color(0x000000);
        scene.add(camera);
        scene.add(light);
    }

    //console.log('viewer cont', light);

    leftPanel = new Panel(document.getElementById('spreadsheet'));

    leftPanel.ms = ms;
    leftPanel.ts = ts;
    leftPanel.tracers = tracers;

    dropd = document.getElementById('dropdown');
    textbox = document.getElementById('textbox');

    camera.position.set(5, 5, 5);
    camera.lookAt(new Vector3(0, 0, 0));
    var cameraTargPos = new Vector3(5, 5, 5);
    var cameraTargView = new Vector3(0, 0, 0);

    var alpha = true;

    var bw = props.darkTheme;

    var stupid = null;

    var doVals = false;

    var lastgi = -1;
    var lastai = -1;


    props.window.dispatchEvent(new Event('hashchange'));

    //sizes = new ScreenSizes();
    // Lights

    // Canvassesses
    const canvas3d = document.querySelector('canvas.webgl'); //viewer
    const canvas2d = document.getElementById('2d'); //spreadsheet

    const controls = new OrbitControls(camera, canvas2d);


    props.screenSizes.updateSizes(leftPanel);

    renderer = new WebGLRenderer({
        canvas: canvas3d
    });


    renderer.setSize(props.screenSizes.width, props.screenSizes.height);
    renderer.setPixelRatio(Math.min(props.window.devicePixelRatio, 2));

    const clock = new Clock();


    //elements    

    const bug1 = document.getElementById('bug1');
    const bug2 = document.getElementById('bug2');
    const bug3 = document.getElementById('bug3');

    //popstate check if leftpanel has lost data
    dropd.addEventListener('change', (event) => {

        //console.log("DROPD", event.target.value);
        [ms, ts, tracers, insights, views] = [
            [],
            [],
            [],
            [],
            []
        ];

        //console.log("CGANGIN", event.target.value);

        if (event.target.value == null || event.target.value == undefined || event.target.value == '') {
            var targ = leftPanel.siteheader;
        } else {
            var targ = event.target.value;
        }

        //console.log("TARG", targ);

        if (targ != defaultDropd) {

            loadSite(targ);

            var modelRef = '/Sites/' + targ + '/' + targ + '.glb';
            
            loadRefAndDoc(modelRef, targ);
        } else {
            //load default

            /*
            load example
            */
            var modelRef = '/Example/example.glb';

            var dataRef = '/Example/data.csv';

            // .glb, load model

            loadRefs(modelRef, dataRef)

            leftPanel.groups = GetGroups(db, targ);
            leftPanel.areas = GetAreas(db, targ);

            /*
            Animate
            */
            leftPanel.siteheader = 'Example';
        }

        //props.window.location.hash = leftPanel.siteheader + '&';

    })

    function loadSite(targ) {
        // .glb, load model

        //var dataRef = ref(storage, '/Sites/' + event.target.value + '/data.csv');

        //loadRefs(modelRef, dataRef)
        leftPanel.groups = GetGroups(db, targ);
        leftPanel.areas = GetAreas(db, targ);
        //console.log("AREAS", leftPanel.areas);
        //console.log("GROUPS", leftPanel.groups);
        //console.log("GETING", targ);

        leftPanel.siteheader = targ;
    }

    const vs = document.getElementById('valueBtnS')

    const ctrlBtn = document.getElementById('ctrlBtn');

    const ctrl = document.getElementById('ctrl');

    const root = document.getElementById('root');

    if (props.site) {
        //LOAD
        ('LOADING SITE: ', props.site);
    } else {
        interpHash();
    }

    if (props.siteList) {//have to wait for resolve
        siteList();
    }

    vs.addEventListener('click', valueButton);
    document.getElementById('valueBtnG').addEventListener('click', valueButton);
    document.getElementById('valueBtnA').addEventListener('click', valueButton);


    function valueButton(e) {
        if (e.target.innerHTML == 'Show values') {
            e.target.innerHTML = 'Hide values';
            //show values
            doVals = true;
        } else {
            e.target.innerHTML = 'Show values';
            //hide values
            doVals = false;
        }
    }

    document.getElementById('opacityBtnS').addEventListener('click', opacityButton);
    document.getElementById('opacityBtnG').addEventListener('click', opacityButton);
    document.getElementById('opacityBtnA').addEventListener('click', opacityButton);

    function opacityButton(e) {
        if (!alpha) {
            e.target.innerHTML = 'Transparent';
            alpha = true;
            //show values
        } else {
            e.target.innerHTML = 'Opaque';
            alpha = false;
            //hide values
        }
    }


    document.getElementById('flipBtn').addEventListener('click', (e) => {

        if (e.target.innerHTML == 'Flip ◐') {
            e.target.innerHTML = 'Flip ◑';
            //show values
        } else {
            e.target.innerHTML = 'Flip ◐';
            //hide values
        }
        //find the difference between click 1 and click 2
        var minx = ((leftPanel.firstClickX < leftPanel.secondClickX) ? leftPanel.firstClickX : leftPanel.secondClickX) - 1;
        var miny = ((leftPanel.firstClickY < leftPanel.secondClickY) ? leftPanel.firstClickY : leftPanel.secondClickY) - 1;
        var x = Math.abs(leftPanel.secondClickX - leftPanel.firstClickX) + minx;
        var y = Math.abs(leftPanel.secondClickY - leftPanel.firstClickY) + miny;

        tracers.forEach((t) => {
            if (t.t.i >= minx && t.t.i <= x && t.m.i >= miny && t.m.i <= y) {
                t.visible = !t.visible;
            }
        })

        if (minx == 0) {
            ms.forEach((m) => {
                if (m.i >= miny && m.i <= y) {
                    m.visible = !m.visible;
                }
            })
        }

        if (miny == 0) {
            ts.forEach((d) => {
                if (d.i >= minx && d.i <= x) {
                    d.visible = !d.visible;
                }
            })
        }
    })

    leftPanel.setcam(camFree);
    document.getElementById('camBtn').addEventListener('click', (e) => {
        if (e.target.innerHTML == 'Multi 🎥') {
            e.target.innerHTML = 'Locked 📷';
            controls.enabled = false;
            camFree = true;
            leftPanel.setcam(camFree)
        } else if (e.target.innerHTML == 'Locked 📷') {
            e.target.innerHTML = 'Free 📹';
            controls.enabled = true;
            camFree = false;
            leftPanel.setcam(camFree)
        } else {
            e.target.innerHTML = 'Multi 🎥';
            controls.enabled = true;
            camFree = true;
            leftPanel.setcam(camFree)
        }

    })

    document.getElementById('resetBtn').addEventListener('click', (e) => {
        if (e.target.innerHTML == 'Toggle all ❎') {
            e.target.innerHTML = 'Toggle all ✅';

            //set every m, t, and tracer to visible
            ms.forEach((m) => {
                m.visible = true;
            })
            ts.forEach((t) => {
                t.visible = true;
            })
            tracers.forEach((t) => {
                t.visible = true;
            })

        } else {
            e.target.innerHTML = 'Toggle all ❎';

            //set every m, t, and tracer to hidden
            ms.forEach((m) => {
                m.visible = false;
            })
            ts.forEach((t) => {
                t.visible = false;
            })
            tracers.forEach((t) => {
                t.visible = false;
            })

        }
    })

    document.getElementById('toggleBtn').addEventListener('click', (e) => {

        var mode = null;

        if (e.target.innerHTML == 'Toggle ◧') {
            e.target.innerHTML = 'Toggle ◨';
            mode = true;
        } else {
            e.target.innerHTML = 'Toggle ◧';
            mode = false;
        }

        //find the difference between click 1 and click 2
        var minx = ((leftPanel.firstClickX < leftPanel.secondClickX) ? leftPanel.firstClickX : leftPanel.secondClickX) - 1;
        var miny = ((leftPanel.firstClickY < leftPanel.secondClickY) ? leftPanel.firstClickY : leftPanel.secondClickY) - 1;
        var x = Math.abs(leftPanel.secondClickX - leftPanel.firstClickX) + minx;
        var y = Math.abs(leftPanel.secondClickY - leftPanel.firstClickY) + miny;

        tracers.forEach((t) => {
            if (t.t.i >= minx && t.t.i <= x && t.m.i >= miny && t.m.i <= y) {
                t.visible = mode;
            }
        })

        if (minx == 0) {
            ms.forEach((m) => {
                if (m.i >= miny && m.i <= y) {
                    m.visible = mode;
                }
            })
        }

        if (miny == 0) {
            ts.forEach((d) => {
                if (d.i >= minx && d.i <= x) {
                    d.visible = mode;
                }
            })
        }
    })

    document.getElementById('groups').addEventListener('click', (e) => {
        leftPanel.next();

        if (leftPanel.spreadsheet == state[0]) {
            //if saved tracers exist, turn them on 
            //display tracers
            e.target.innerHTML = 'Groups'; //button indicates next state
            bug1.style.display = 'grid'
            bug2.style.display = 'none'
            bug3.style.display = 'none'
            props.screenSizes.spreadsheetDiv.style.overflow = 'hidden';
        } else if (leftPanel.spreadsheet == state[1]) {
            //display groups
            e.target.innerHTML = 'Areas'; //button indicates next state
            bug1.style.display = 'none'
            bug2.style.display = 'grid'
            bug3.style.display = 'none'
            props.screenSizes.spreadsheetDiv.style.overflow = 'auto';
        } else if (leftPanel.spreadsheet == state[2]) {
            //display areas
            e.target.innerHTML = 'Tracers'; //button indicates next state
            bug1.style.display = 'none'
            bug2.style.display = 'none'
            bug3.style.display = 'grid'
            props.screenSizes.spreadsheetDiv.style.overflow = 'auto';
        }
        props.screenSizes.updateSizes(leftPanel);
    })

    function updateCam() {

        //console.log(leftPanel.camFree, leftPanel.looking, leftPanel.spreadsheet, leftPanel.n, leftPanel.gi)

        if (leftPanel.camFree && leftPanel.spreadsheet == state[0]) {
            try {
                //fail quietly if cannot set camera
                if (leftPanel.mt == 0) {

                } else if (leftPanel.mt == 2) {
                    //if y (row) == 1, ts

                    cameraTargPos = new Vector3(parseFloat(ts[leftPanel.n].pos.x) + 14, parseFloat(ts[leftPanel.n].pos.z) + 30, parseFloat(ts[leftPanel.n].pos.y) + 8);
                    cameraTargView = new Vector3(parseFloat(ts[leftPanel.n].pos.x), parseFloat(ts[leftPanel.n].pos.z), parseFloat(ts[leftPanel.n].pos.y));

                    //throws errors if it trys to select row before/after last
                } else if (leftPanel.mt == 1) {
                    //if x (column) == 1, ms
                    //special views
                    //console.log(views[leftPanel.n + 1])
                    if (views[leftPanel.n + 1] != null && views[leftPanel.n + 1][0] != '') {
                        cameraTargPos = new Vector3(parseFloat(views[leftPanel.n + 1][0]), parseFloat(views[leftPanel.n + 1][1]), parseFloat(views[leftPanel.n + 1][2]));
                    } else {

                        cameraTargPos = new Vector3(parseFloat(ms[leftPanel.n].pos.x) + 14, parseFloat(ms[leftPanel.n].pos.z) + 30, parseFloat(ms[leftPanel.n].pos.y) + 8);

                    }
                    cameraTargView = new Vector3(parseFloat(ms[leftPanel.n].pos.x), parseFloat(ms[leftPanel.n].pos.z), parseFloat(ms[leftPanel.n].pos.y));

                    //insights
                    if (leftPanel.spreadsheet) {
                        textbox.value = (insights[leftPanel.n + 2] == null) ? '' : decodeURI(insights[leftPanel.n + 2]).replaceAll('~', ',');
                        if (textbox.value == '') {
                            textbox.style.display = 'none';
                        } else {
                            textbox.style.display = 'block';
                        }
                    } else {

                        textbox.value = (leftPanel.text == null) ? '' : decodeURI(leftPanel.text).replaceAll('~', ',');
                        if (textbox.value == '') {
                            textbox.style.display = 'none';
                        } else {
                            textbox.style.display = 'block';
                        }
                    }


                }
            } catch (e) {
                //console.log(e)
            }
        } else if (leftPanel.spreadsheet == state[1] && leftPanel.camFree) {

            if (leftPanel.gi) {
                var i = leftPanel.gi;
            } else {
                var i = 0;
            }
            try {
                cameraTargPos = new Vector3(leftPanel.groups[i]['pos'][0] + 5, leftPanel.groups[i]['pos'][2] + 10, leftPanel.groups[i]['pos'][1] + 3);
                cameraTargView = new Vector3(leftPanel.groups[i]['pos'][0], leftPanel.groups[i]['pos'][2], leftPanel.groups[i]['pos'][1]);
            } catch (e) { }

            //console.log(cameraTargPos, cameraTargView)

        } else if (leftPanel.spreadsheet == state[2] && leftPanel.camFree) {

            if (leftPanel.ai) {
                var i = leftPanel.ai;
            } else {
                var i = 0;
            }
            try {
                cameraTargPos = new Vector3(leftPanel.areas[i].avgPos()[0] + 5, leftPanel.areas[i].avgPos()[2] + 10, leftPanel.areas[i].avgPos()[1] + 3);
                cameraTargView = new Vector3(leftPanel.areas[i].avgPos()[0], leftPanel.areas[i].avgPos()[2], leftPanel.areas[i].avgPos()[1]);
            } catch (e) { }
        }
    }

    function loadRefAndDoc(ref, doc) {

        getBlobe(ref)
            .then((blob) => {
                import('../viewer/modelHandler.js').then((module) => {
                    console.log('model transfered RD, loading...');
                    module.handleModels(blob, scene);
                })
            })
            .catch((err) => {
                console.error('transfer error...');
                console.error(err);
            })

        RemoteData(db, doc).then((data) => {

            [ms, ts, tracers, insights, views] = data;

            //console.log(ms, ts, tracers, insights, views)

            leftPanel.setTracers(ms, ts, tracers)

            if (stupid != null) {
                leftPanel.gi = stupid;
                stupid = null;
            }

            props.screenSizes.updateSizes(leftPanel);

        }).catch((err) => {
            //console.error(err);
        })


    }

    function loadRefs(ref1, ref2) {

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
                handleFiles(blob, props.screenSizes);
            })
            .catch((err) => {
                console.error('No Data', err);
            })

    }

    document.addEventListener('DOMContentLoaded', (e) => {
        props.screenSizes.updateSizes(leftPanel);
    })

    //canvas
    // document.getElementById('title').addEventListener('click', (e) => {

    //     bw = !bw;

    //     leftPanel.setbw(bw)

    //     if (bw) {
    //         e.target.innerHTML = 'Light Mode';
    //         scene.background = new Color(0x000000);
    //     } else {
    //         e.target.innerHTML = 'Dark Mode';
    //         scene.background = new Color(0xffffff);
    //     }
    // })


    function stoplookin() {
        if (leftPanel.camFree) {
            leftPanel.looking = false;
        }
    }
    //console.log('viewer cont', props, props.screenSizes);
    props.screenSizes.canvas2d.addEventListener('mousedown', (e) => {
        stoplookin();
    })

    props.screenSizes.canvas2d.addEventListener('wheel', (event) => {
        stoplookin();
    }, {
        passive: true
    });

    props.screenSizes.canvas2d.addEventListener('contextmenu', (e) => {
        stoplookin();

        e.preventDefault();
    })

    props.screenSizes.canvas2d.addEventListener('click', (e) => {
        stoplookin();

        //store pos in link
        var pos = String('P=' + Math.round(camera.position.x * 100) / 100) + '/' + String(Math.round(camera.position.y * 100) / 100) + '/' + String(Math.round(camera.position.z * 100) / 100) + '/' + String(Math.round(camera.rotation.x * 100) / 100) + '/' + String(Math.round(camera.rotation.y * 100) / 100) + '/' + String(Math.round(camera.rotation.z * 100) / 100)

        if (pos[0] != null) {
            props.window.location.hash = leftPanel.siteheader + '&' + pos;
        }
    },
        false);

    textbox.addEventListener('input', e => {
        if (textbox.readOnly == false) {
            if (leftPanel.spreadsheet == state[0]) {
                insights[leftPanel.firstClickY] = encodeURI(textbox.value.replaceAll(/,/g, '~'));
            } else {
                leftPanel.text = encodeURI(textbox.value.replaceAll(/,/g, '~'))
                //console.log(leftPanel.text);
            }
        }
    })

    function interpHash() {

        var hash = props.window.location.hash.substring(1)

        if (hash[0] != '&') {
            var params = hash.split('&');


            if (params[0] != leftPanel.siteheader && params[0][0] != 'X' && params[0][0] != 'P' && params[0][0] != 'G') {
                leftPanel.siteheader = params[0];
                dropd.value = params[0];
                dropd.dispatchEvent(new Event('change'));
            }

            if (params[1] && params[1][0] == 'G') {
                //setTimeout(giHack, 1500, params);
                leftPanel.spreadsheet = state[1];
                if (params[0] != leftPanel.siteheader) {
                    stupid = params[1].substring(2);
                } else {
                    leftPanel.gi = params[1].substring(2);
                    props.screenSizes.updateSizes(leftPanel);
                }


            } else if (params[1] && params[1][0] == 'X') {
                leftPanel.spreadsheet = state[0];
                if (params[1].substring(2) != leftPanel.cellX || params[2].substring(2) != leftPanel.cellY) {
                    leftPanel.firstClickX = params[0].substring(2);
                    leftPanel.firstClickY = params[1].substring(2);
                    updateCam();

                    //leftPanel.canvas.dispatchEvent(new Event('click'));
                }
            } else if (params[1] && params[1][0] == 'P') {

                var coords = params[1].substring(2).split('/')

                var pos = new Vector3(parseFloat(coords[0]), parseFloat(coords[1]), parseFloat(coords[2]))
                //var rot = new Vector3(parseFloat(coords[3]), parseFloat(coords[4]), parseFloat(coords[5]))

                //                                   min dist
                if (camera.position.distanceTo(pos) > .03) {

                    //console.log('moving camera');
                    // if (leftPanel.camFree) {
                    //    leftPanel.looking = true;
                    //}

                    cameraTargPos = pos
                    camera.rotation.set(parseFloat(params[3]), parseFloat(params[4]), parseFloat(params[5]))

                    controls.update();
                    updateCam();

                }

            }
        }
        //set font size with shortest of ms and ds
        let lengthms = ms.length;
        let lengthds = ts.length;
        leftPanel.setFontsize(Math.min(lengthms, lengthds));

    }

    //file input
    props.window.addEventListener('hashchange', (e) => {
        interpHash();

    });

    //resize
    props.window.addEventListener('resize', () => {
        // Update props.screenSizes
        props.screenSizes.updateSizes(leftPanel);

        // Update camera
        camera.aspect = props.screenSizes.width / props.screenSizes.height;
        camera.updateProjectionMatrix();

        // Update renderer
        renderer.setSize(props.screenSizes.width, props.screenSizes.height);
        renderer.setPixelRatio(Math.min(props.window.devicePixelRatio, 2));
    })

    if (props.window.location.hash == '' || props.window.location.hash[1] == '&') {
        let path0 = '/Example/example.glb'
        let path1 = '/Example/data.csv'
        loadRefs(path0, path1);
    }

    const tick = () => {

        const elapsedTime = clock.getElapsedTime();
        if (leftPanel) {
            if (leftPanel.looking || leftPanel.state == state[1]) {
                updateCam();
            }


            //if camera.position isnt cameraTargPos, move camera towards point
            if (leftPanel.looking && camera.position.distanceTo(cameraTargPos) > .05) {
                camera.position.lerp(cameraTargPos, .03)
            } else if (leftPanel.looking && controls && controls.target.distanceTo(cameraTargView) < .05) {
                leftPanel.looking = false;
            }

            //if controls.target isnt cameraTargView, turn camera towards point
            if (leftPanel.looking && controls && controls.target.distanceTo(cameraTargView) > .05) {
                controls.target.lerp(cameraTargView, .03)
            } else if (leftPanel.looking && camera.position.distanceTo(cameraTargPos) < .05) {
                leftPanel.looking = false;
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
        if (leftPanel) {
            leftPanel.ctx.clearRect(0, 0, leftPanel.canvas.width, leftPanel.canvas.height);
        }
        //Tracers
        if (leftPanel.spreadsheet != state[2]) {
            tracers.forEach(t => t.drawTracer(leftPanel, camera, props.screenSizes, alpha, doVals));

            //Points
            ms.forEach(pt => pt.drawPt(leftPanel, camera, props.screenSizes, props.darkTheme));
            ts.forEach(pt => pt.drawPt(leftPanel, camera, props.screenSizes, props.darkTheme));
        }

        if (leftPanel) {
            if (props.darkTheme) {
                leftPanel.ctx.fillStyle = 'black';
            } else {
                leftPanel.ctx.fillStyle = 'white';
            }

            leftPanel.frame(textbox);
        }
        //values
        if (doVals && leftPanel.spreadsheet == state[0]) {
            tracers.forEach(t => t.drawValues(leftPanel.ctx, leftPanel.cellWidth, leftPanel.cellHeight));
        }


        if (leftPanel && leftPanel.spreadsheet == state[1] && leftPanel.gi) {
            if (leftPanel.gi != lastgi) {
                lastgi = leftPanel.gi;

                ms.forEach(pt => pt.visible = false);
                ts.forEach(pt => pt.visible = false);

                tracers.forEach((t) => {
                    var label = String(t.m.i) + "/" + String(t.t.i);

                    try {
                        t.visible = leftPanel.groups[lastgi][label];
                    } catch (e) {
                        //console.log(leftPanel.groups0, lastgi, leftPanel.groups[lastgi], label)
                    }

                    if (t.visible) {
                        t.m.visible = true;
                        t.t.visible = true;
                    }
                })
            }
        }

        if (leftPanel && leftPanel.spreadsheet == state[2]) {

            if (leftPanel.ai != lastai && leftPanel.areas[lastai]) {
                lastai = leftPanel.ai;

                leftPanel.areas[lastai].visible = !leftPanel.areas[lastai].visible;
            }

            leftPanel.areas.forEach(a => {
                if (a != undefined) {
                    a.drawArea(camera, props.screenSizes, doVals, alpha);
                }
            });
            if (workingArea) {
                workingArea.drawArea(camera, props.screenSizes, doVals, true, 'last');
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