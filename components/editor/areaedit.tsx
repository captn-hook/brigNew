import { Vector3 } from 'three'
import { storePos } from "../viewer/listeners";
import { EditorProps } from "../viewer/Context";
import { Area } from "../viewer/Area";

// // delete area
// dArea.addEventListener('click', (e) => {
//     //console.log("D", leftPanel.ai)
//     //console.log('deleting area', leftPanel.ai + 1)
//     deleteDoc(doc(db, V.dropd.value, 'area' + (V.leftPanel.ai + 1)));
//     V.leftPanel.areas[V.leftPanel.ai] = undefined;
// })


// // add point to working area
// aArea.addEventListener('click', tnalp4)

// async function tnalp4() {
//     print(V.workingArea.points.length)
//     if (V.workingArea.points.length > 2) {
//         var i = 0;
//         V.workingArea.text = V.leftPanel.text;
//         V.leftPanel.areas.forEach((e) => {
//             if (e != undefined) {
//                 i++;
//             }
//         })

//         var n = prompt("Enter Area Name");
//         V.workingArea.name = String(n);

//         var x = prompt("Enter Area Value");
//         V.workingArea.setValue(parseFloat(x));

//         var a = new Area(V.workingArea.points, V.workingArea.value, V.workingArea.name, V.workingArea.text)

//         V.leftPanel.areas.push(a);
//         //console.log("A", leftPanel.ai)
//         saveArea(db, V.dropd.value, i + 1, a)
//         V.resetWorkingArea();
//     }
// }

// // remove point from working area
// V.sizes.canvas2d.addEventListener('contextmenu', (e) => {
//     e.preventDefault();

//     if (editPos && (V.leftPanel.spreadsheet == V.state[2] || V.leftPanel.spreadsheet == V.state[1])) {
//         V.workingArea.points.pop();
//     }

// })

export function getWorkingArea(props: EditorProps) {
    for (let i = 0; i < props.areas.length; i++) {
        if (props.areas[i].value === undefined || Number.isNaN(props.areas[i].value)) {
            return props.areas[i]
        }
    }
    props.areas.push(new Area())
    props.setProps(props)
    return props.areas[props.areas.length - 1]
}

export function addPoint(props: EditorProps, point: Vector3) {
    const workingArea = getWorkingArea(props)
    if (workingArea === undefined) {
        return
    }
    const areaName = workingArea.name;
    const areaIndex = props.areas.findIndex(area => area.name === areaName);
    if (areaIndex !== -1) {
        props.areas[areaIndex].points.push(point);
    }
}

export function removePoint(props: EditorProps) {
    const workingArea = getWorkingArea(props)
    if (workingArea === undefined) {
        return
    }
    workingArea.points.pop();
}

export function deleteArea(props: EditorProps) {
    const workingArea = getWorkingArea(props)
    if (workingArea === undefined) {
        return
    }
    const areaName = workingArea.name;
    const areaIndex = props.areas.findIndex(area => area.name === areaName);
    console.log(props.areas[areaIndex])
    console.log(props.areas)
}

export function addArea(props: EditorProps) {
    console.log(props.areas)
}