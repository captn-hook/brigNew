import { Vector3 } from 'three'
import { EditorProps } from "../viewer/Context";
import { Area } from "../viewer/Area";


export function addPoint(props: EditorProps, point: Vector3) {
    props.workingArea.points.push(point);
}

export function removePoint(props: EditorProps) {
    if (props.workingArea.points.length === 0) {
        return
    }
    props.workingArea.points.pop();
}

export function deleteArea(props: EditorProps) {
    // get selected area and remove it
    console.log(props.areas)
}

export function addArea(props: EditorProps) {
    console.log(props.areas)
}