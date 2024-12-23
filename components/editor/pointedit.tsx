import { Vector3 } from 'three'
import { Point2d } from '../viewer/Point';
import { Tracer2d } from '../viewer/Tracer';
import { storePos } from "../viewer/listeners";
import { EditorProps } from "../viewer/Context";


function appendNewMTracers(props: EditorProps, m: Point2d) {
    storePos(props); // <--- urg!
    //ez just append new row
    props.ts.forEach((e) => {
        props.tracers.push(new Tracer2d(m, e, .1));
    })
}

function appendNewTTracers(props: EditorProps, t: Point2d) {
    //get rows append one tracer to each row and rejoin
    var temp: Tracer2d[] = [];
    props.ms.forEach((e) => {
        temp.push(new Tracer2d(e, t, .1));
    })
    var temp2 = [];
    //slice tracers into rows
    for (let i = 0; i < props.ms.length; i++) {
        temp2.push(props.tracers.slice(i * props.ts.length, (i + 1) * props.ts.length));
    }

    //append new tracer to each row
    for (let i = 0; i < temp2.length; i++) {
        temp2[i].push(temp[i]);
    }
    //rejoin rows
    // props.tracers = temp2.flat();
    // empty tracers
    for (let i = props.tracers.length; i > 0; i--) {
        props.tracers.pop();
    }
    // rejoin tracers
    for (let i = 0; i < temp2.length; i++) {
        for (let j = 0; j < temp2[i].length; j++) {
            props.tracers.push(temp2[i][j]);
        }
    }
}

function deleteTracers(point: Point2d, props: EditorProps) {
    // delete all tracers with the given point
    for (let i = props.tracers.length - 1; i >= 0; i--) {
        if (props.tracers[i].m as unknown as Point2d == point || props.tracers[i].t as unknown as Point2d == point) {
            props.tracers.splice(i, 1);
        }
    }
}

function propagatePointDelete(bool: boolean, index: number, props: EditorProps) {
    // -1 to evey index greater than index and rename
    // index is the real index from zero, name and i are index + 1
    if (bool) {
        for (let i = index; i < props.ms.length; i++) {
            props.ms[i].i = i + 1;
            // replace any occurence of i + 2 in the name with i + 1
            props.ms[i].name = props.ms[i].name.replace((i + 2).toString(), (i + 1).toString());
        }
    } else {
        for (let i = index; i < props.ts.length; i++) {
            props.ts[i].i = i + 1;
            // replace any occurence of i + 1 with i
            props.ts[i].name = props.ts[i].name.replace((i + 2).toString(), (i + 1).toString());
        }
    }
}

export function deleteSelectedPoint(coords: { x: number, y: number }, props: EditorProps) {
    // if a point is selected, delete it, (x or y will be 1, but not both)
    if (coords.x === 1) {
        // delete the row
        deleteTracers(props.ms[coords.y - 2], props);
        var index = props.ms[coords.y - 2].i - 1;
        props.ms.splice(coords.y - 2, 1);
        propagatePointDelete(true, index, props);
    } else if (coords.y === 1) {
        // delete the column
        deleteTracers(props.ts[coords.x - 2], props);
        var index = props.ts[coords.x - 2].i - 1;
        props.ts.splice(coords.x - 2, 1);
        propagatePointDelete(false, index, props);
    }
    props.screenSizes.updateSizes(props);
}

export function newPoint(props: EditorProps, bool = true, pos = new Vector3(0, 0, 0)) {

    if (bool) {
        let i = props.ms.length;
        props.ms.push(new Point2d("M", i + 1, 'red', pos, 7));
        appendNewMTracers(props, props.ms[props.ms.length - 1]);
        props.setProps(props);
    } else {
        let i = props.ts.length;
        props.ts.push(new Point2d("D", i + 1, 'blue', pos, 3.5));
        appendNewTTracers(props, props.ts[props.ts.length - 1]);
        props.setProps(props);
    }
    props.screenSizes.updateSizes(props);
}