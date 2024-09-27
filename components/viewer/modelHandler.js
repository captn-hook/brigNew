import { AmbientLight, TextureLoader } from 'three';

export var globalObj;
export var sceneMeshes = [];

function newLight(scene) {
    //look for a light
    for (let i = 0; i < scene.children.length; i++) {
        if (scene.children[i].type == "AmbientLight") {
            return;
        }
    }
    const light = new AmbientLight(0x404040); // soft white light
    light.intensity = 10;
    scene.add(light);
}

function emptyS(scene) {
    while (scene.children.length > 0) {
        //if not a light
        if (scene.children[0].type != "AmbientLight") {
            scene.remove(scene.children[0]);
        } else if (scene.children.length > 1) {
            scene.remove(scene.children[1]);
        } else {
            break;
        }
    }
}

export function handleModels(input, scene, setLoading) {
    //remove old stuff first
    emptyS(scene);
    // if (globalObj != null) {
    //     scene.remove(globalObj);
    // }

    //re add the light
    newLight(scene);

    var read = new FileReader();

    read.readAsArrayBuffer(input);

    read.onloadend = function () {

        getDRACOLoader().then((loader) => {

            loader.parse(read.result, '', onLoadWrapper(scene, setLoading), onErrorLog, (e) => {
                //console.log('loading ???', e);
            });
            setLoading(false);
        })

    }
}

export function exHandleModels(input, scene, setLoading) {
    //remove old stuff first
    emptyS(scene);

    var read = new FileReader();

    read.readAsArrayBuffer(input);

    read.onloadend = function () {

        getDRACOLoader().then((loader) => {
            loader.parse(read.result, '', onLoadWrapper(scene, setLoading), onErrorLog, (e) => {
                //console.log('loading ???', e);
            });
        })

    }
}

export function obHandleModels(input, inmat, texs, scene, setLoading) {
    emptyS(scene);

    var read = new FileReader();
    //input is a obj file
    read.readAsDataURL(input);
    read.onloadend = function () {
        var obj = read.result;
        //.mtl
        read.readAsText(inmat);
        read.onloadend = function () {
            var mat = read.result;
            //and textures
            var tex = [];
            for (let i = 0; i < texs.length; i++) {
                var iread = new FileReader();
                iread.readAsDataURL(texs[i]);
                iread.onloadend = function () {
                    tex.push(iread.result);
                    if (tex.length == texs.length) {
                        mid(obj, mat, tex, scene, setLoading);
                    }
                }
            }
        }
    }
}

function mid(obj, mat, texs, scene, setLoading) {
    //now we have all the files

    getOBJLoaders().then((loaders) => {
        const mtlLoader = new loaders[0]();
        const objLoader = new loaders[1]();
        //load the textures
        var textures = [];
        for (let i = 0; i < texs.length; i++) {
            const textureLoader = new TextureLoader();
            textureLoader.load(texs[i], (tex) => {
                textures.push(tex);
                if (textures.length == texs.length) {
                    finish(mtlLoader, objLoader, scene, mat, obj, textures, setLoading);
                }
            }, onProgressLog, onErrorLog);
        }
    });
}

function finish(mtlLoader, objLoader, scene, mat, obj, textures, setLoading) {
    //set the textures
    //mtlLoader.setResourcePath(textures[0].image.src);
    var mtl = mtlLoader.parse(mat);
    //mtlLoader.load(mat, (mtl) => {
    //deep copy the mtl for logging
    //var newmtl = JSON.parse(JSON.stringify(mtl));

    mtl.preload();
    var newmtl = JSON.parse(JSON.stringify(mtl));
    //for all keys in mtl.materials
    for (let i = 0; i < Object.keys(mtl.materials).length; i++) {
        //print i.map
        //console.log('i: ', i, ' map: ', mtl.materials[Object.keys(mtl.materials)[i]].map);
        mtl.materials[Object.keys(mtl.materials)[i]].map = textures[i];
    }
    objLoader.setMaterials(mtl);
    objLoader.load(obj, onLoadWrapper(scene, setLoading, true), onProgressLog, onErrorLog);
    //});
}

function onLoadWrapper(scene, setLoading, isObj = false) {

    // onLoad callback
    function onLoadLoad(obj) {

        sceneMeshes = [];

        sceneMeshes.push(obj.scene.children[0]);

        obj.scene.children[0].children.forEach((e) => {
            sceneMeshes.push(e);
        })

        scene.add(obj.scene);
        setLoading(false);
        //globalObj = scene.children[scene.children.length - 1];
    }

    function onLoadOBJ(obj) {
        //obj loads as a group, so we need to add each child to the scene
        obj.children.forEach((e) => {
            scene.add(e);
        })
        setLoading(false);
        //globalObj = scene.children[scene.children.length - 1];
    }

    if (isObj) {
        return onLoadOBJ;
    } else {
        return onLoadLoad;
    }
}

// onProgress callback
function onProgressLog(xhr) {
    //console.log("LOADING: ", xhr.loaded / xhr.total * 100);
}

// onError callback
function onErrorLog(err) {
    console.error(err)
}

function getGLTFLoader() {
    return import('three/examples/jsm/loaders/GLTFLoader.js').then((GLTF) => {
        return new GLTF.GLTFLoader;
    });
}

function getDRACOLoader() {
    return getGLTFLoader().then((GLTFLoader) => {
        return import('three/examples/jsm/loaders/DRACOLoader.js').then((DRACO) => {

            const DRACOLoader = new DRACO.DRACOLoader();

            DRACOLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

            GLTFLoader.setDRACOLoader(DRACOLoader);

            return GLTFLoader;
        });
    })
}

function getOBJLoaders() {
    //     import { MTLLoader } from '../js/examples/jsm/loaders/MTLLoader.js';
    //     import { OBJLoader } from '../js/examples/jsm/loaders/OBJLoader.js';
    return import('three/examples/jsm/loaders/MTLLoader.js').then((MTLLoader) => {
        return import('three/examples/jsm/loaders/OBJLoader.js').then((OBJLoader) => {
            return [MTLLoader.MTLLoader, OBJLoader.OBJLoader];
        });
    })
}