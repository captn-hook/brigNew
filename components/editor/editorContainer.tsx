import { Props, LeftPanelContext, ScreenSizesContext } from "../viewer/Context";
import { useCallback, useRef, useContext, useState, useEffect } from 'react';
import { useTheme } from "next-themes";
import { Sidebar } from "@/components/sidebar";
import { Viewport, ViewportControl } from "@/components/viewer/viewport";
import { Button, ButtonGroup } from '@nextui-org/button';
import Image from 'next/image';
import {
    Raycaster,
    Vector2,
    Vector3,
} from 'three';
import { Point2d } from '../viewer/Point';
import { Tracer2d } from '../viewer/Tracer';
import { renderer, camera } from "../viewer/viewer";
import { sceneMeshes } from "../viewer/modelHandler";

export function AreaControl(props: Props) {

    return (
        <div style={{
            marginTop: '2rem',
            display: 'flex',
            justifyContent: 'flex-start',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
        }}>
            <h2>Area Control</h2>
            <ButtonGroup aria-label="Area Control">
                <Button onClick={() => console.log("new area")}>New Area</Button>
                <Button onClick={() => console.log("delete area")}>Delete Area</Button>
            </ButtonGroup>
            <ButtonGroup aria-label="Save">
                <Button onClick={() => console.log("save")}>Save</Button>
            </ButtonGroup>
        </div>

    );
}

function appendNewMTracers(props: Props, m: Point2d) {
    //ez just append new row
    props.ts.forEach((e) => {
        props.tracers.push(new Tracer2d(m, e, 1));
    })
}

function appendNewTTracers(props: Props, t: Point2d) {
    //get rows append one tracer to each row and rejoin
    var temp: Tracer2d[] = [];
    props.ms.forEach((e) => {
        temp.push(new Tracer2d(e, t, 1));
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

function newPoint(props: Props, bool = true, pos = new Vector3(0, 0, 0)) {
    if (bool) {
        let i = props.ms.length;
        props.ms.push(new Point2d("M", i + 1, 'red', pos, 7));
        appendNewMTracers(props, props.ms[props.ms.length - 1]);
    } else {
        let i = props.ts.length;
        props.ts.push(new Point2d("D", i + 1, 'blue', pos, 3.5));
        appendNewTTracers(props, props.ts[props.ts.length - 1]);
    }
    props.screenSizes.updateSizes(props);
}

function deleteTracers(point: Point2d, props: Props) {
    // delete all tracers with the given point
    for (let i = props.tracers.length - 1; i >= 0; i--) {
        if (props.tracers[i].m as unknown as Point2d == point || props.tracers[i].t as unknown as Point2d == point) {
            props.tracers.splice(i, 1);
        }
    }
}

function propagatePointDelete(bool: boolean, index: number, props: Props) {
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

function deleteSelectedPoint(coords: { x: number, y: number }, props: Props) {
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

function getIntersects(xi: number, yi: number, props: Props) {
    var raycaster = new Raycaster();
    var mouse = new Vector2((xi - props.leftPanel.canvas.innerWidth) / renderer.domElement.clientWidth * 2 - 1, -(yi / renderer.domElement.clientHeight) * 2 + 1);

    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(sceneMeshes, true);
    return intersects;
}

function canvasDropListener(e: any, props: Props) {
    console.log("dropped", e);
    e.preventDefault();
    let data = e.dataTransfer.getData("text");
    let xi = e.clientX;
    let yi = e.clientY;
    let intersects = getIntersects(xi, yi, props);
    if (intersects.length > 0) {
        if (data === "M") {
            newPoint(props, true, new Vector3(intersects[0].point.x, intersects[0].point.z, intersects[0].point.y));
        } else if (data === "D") {
            newPoint(props, false, new Vector3(intersects[0].point.x, intersects[0].point.z, intersects[0].point.y));
        }
    }
}

export default function EditorControl(props: Props, canvas2d: React.RefObject<HTMLCanvasElement> | null = null) {


    const leftPanel = useContext(LeftPanelContext);

    // add ref callback to canvas2d 

    const [currentClickedValue, setCurrentClickedValue] = useState(-1);
    const [index, setIndex] = useState(-1);
    const [coords, setCoords] = useState({ x: 0, y: 0 });

    leftPanel.clickCallback = (x: number, y: number) => {
        // get the tracer at the clicked position from props.ts and props.ms -> props.tracers[index]
        // two dimensions to 1d array
        const m = y - 2;
        const t = x - 2;
        const index = m * props.ts.length + t;
        setCoords({ x: x, y: y });
        if (props.tracers[index]) {
            setIndex(index);
            setCurrentClickedValue(props.tracers[index].value);
        }
    }

    return (
        <div style={{
            marginTop: '2rem',
            display: 'flex',
            justifyContent: 'flex-start',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
        }}>
            <h2>Data Control</h2>
            <input type="text" placeholder={currentClickedValue === -1 ? "Click on a point to edit" : currentClickedValue.toString()}
                onChange={(e) => {
                    // if the value is a number greater than or equal to 0, and less than or equal to 100 update the value of the clicked point
                    if (index != -1 && typeof parseFloat(e.target.value) === "number" && parseFloat(e.target.value) <= 100 && parseFloat(e.target.value) >= 0) {
                        props.tracers[index].updateValue(parseFloat(e.target.value));
                        props.screenSizes.updateSizes(props);
                    }
                }} />
            <ButtonGroup aria-label="Data Control">
                <Button onClick={() => newPoint(props, true)}>New Row</Button>
                <Button onClick={() => newPoint(props, false)}>New Column</Button>
            </ButtonGroup>

            <ButtonGroup aria-label="Point Control">
                <Image src="/m.svg" width={40} height={40} draggable={true}
                    onDragStart={(e) => { e.dataTransfer.setData("text", "M") }}
                    onTouchEnd={(e) => {
                        let xi = e.changedTouches[0].pageX;
                        let yi = e.changedTouches[0].pageY;
                        let intersects = getIntersects(xi, yi, props);
                        if (intersects.length > 0) {
                            newPoint(props, true, new Vector3(intersects[0].point.x, intersects[0].point.z, intersects[0].point.y));
                        }
                    }}
                    alt="M" />
                <Image src="/d.svg" width={40} height={40} draggable={true}
                    onDragStart={(e) => { e.dataTransfer.setData("text", "D") }}
                    onTouchEnd={(e) => {
                        let xi = e.changedTouches[0].pageX;
                        let yi = e.changedTouches[0].pageY;
                        let intersects = getIntersects(xi, yi, props);
                        if (intersects.length > 0) {
                            newPoint(props, false, new Vector3(intersects[0].point.x, intersects[0].point.z, intersects[0].point.y));
                        }
                    }}
                    alt="D" />
            </ButtonGroup>

            <ButtonGroup aria-label="Point Control">
                <Button onClick={() => deleteSelectedPoint(coords, props)}>Delete Selected Point</Button>
            </ButtonGroup>

            <ButtonGroup aria-label="Save">
                <Button onClick={() => console.log("save")}>Save</Button>
            </ButtonGroup>
        </div>
    );
}

export const EditorContainer = () => {

    const { theme, setTheme } = useTheme();
    const screenSizes = useContext(ScreenSizesContext);
    const leftPanel = useContext(LeftPanelContext);
    
    var div3dRef = useRef<HTMLDivElement>(null);
    var webglRef = useRef<HTMLCanvasElement>(null);
    var canvas2dRef = useRef<HTMLCanvasElement>(null);

    const [props, setProps] = useState<Props>({
        sheetState: [leftPanel.spreadsheet],
        bools: [false, false, false, false, false, false, theme === "dark"],
        leftPanel: leftPanel,
        ms: [],
        ts: [],
        tracers: [],
        areas: [],
        views: [],
        insights: [],
        site: "",
        sitelist: [""],
        window: null,
        screenSizes: screenSizes
    });

    useEffect(() => {
        setProps({
            sheetState: [leftPanel.spreadsheet],
            bools: [false, false, false, false, false, false, theme === "dark"],
            leftPanel: leftPanel,
            ms: [],
            ts: [],
            tracers: [],
            areas: [],
            views: [],
            insights: [],
            site: "",
            sitelist: [""],
            window: window,
            screenSizes: screenSizes
        });

    }, [theme]);

    // gets the refs out of viewport so everything can use them
    function refReturner(div3d: any, canvas2d: any, webgl: any) {
        div3dRef = div3d;
        canvas2dRef = canvas2d;
        webglRef = webgl;
    }

    useEffect(() => {
        if (canvas2dRef.current != null) {
            canvas2dRef.current.addEventListener('drop', (e: any) => canvasDropListener(e, props));
            canvas2dRef.current.addEventListener('dragover', (e: any) => e.preventDefault());
        }
    }, [props, canvas2dRef]);


    return (
        <Sidebar
            firstChild={
                <div>
                    <ViewportControl {...{ ...props, childOne: <EditorControl {...props} />, childTwo: <AreaControl {...props} />, canvas2d: canvas2dRef }} />
                </div>
            }
            secondChild={
                <Viewport {...{ ...props, refs: { div3dRef, webglRef, canvas2dRef, refReturner } }} />
            }
        />
    );
};