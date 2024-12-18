import { EditorProps, LeftPanelContext, ScreenSizesContext, EditorContext } from "../viewer/Context";
import { useContext, useState, useEffect } from 'react';
import { useTheme } from "next-themes";
import { Sidebar } from "@/components/sidebar";
import { Viewport, ViewportControl } from "@/components/viewer/viewport";
import { Button, ButtonGroup } from '@nextui-org/button';
import Image from 'next/image';
import {
    Object3D,
    Raycaster,
    Vector2,
    Vector3,
} from 'three';
import { renderer, camera } from "../viewer/viewer";
import { sceneMeshes } from "../viewer/modelHandler";
import { saveArea, sendFile, saveFile } from "../viewer/Data";
import { db } from "../auth";

import { newPoint, deleteSelectedPoint } from "./pointedit";

export function AreaControl(props: EditorProps) {

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
                <Button id="addArea">New Area</Button>
                <Button id="deleteArea">Delete Area</Button>
            </ButtonGroup>
            <ButtonGroup aria-label="Save">
                <Button onClick={() => saveArea(props)}>Save</Button>
            </ButtonGroup>
        </div>

    );
}

function getIntersects(xi: number, yi: number, props: EditorProps) {
    var raycaster = new Raycaster();
    var mouse = new Vector2((xi - props.leftPanel.canvas.innerWidth) / renderer.domElement.clientWidth * 2 - 1, -(yi / renderer.domElement.clientHeight) * 2 + 1);
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(sceneMeshes, true);

    if (intersects.length > 0) {
        return intersects;
    }

    if (intersects.length === 0 && sceneMeshes.length > 0) {
        sceneMeshes.forEach((e) => {
            e.traverseAncestors((a: Object3D) => {
                intersects = raycaster.intersectObject(a, true);
                if (intersects.length > 0) {
                    return intersects;
                }
            });
        });
    }

    return intersects;
}

function canvasDropListener(e: any, props: EditorProps) {

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



export default function EditorControl(props: EditorProps) {


    // add ref callback to canvas2d 

    const [currentClickedValue, setCurrentClickedValue] = useState(-1);
    const [coords, setCoords] = useState({ x: 0, y: 0 });

    props.leftPanel.clickCallback = (x: number, y: number) => {
        // get the tracer at the clicked position from props.ts and props.ms -> props.tracers[index]
        // two dimensions to 1d array
        const m = y - 2;
        const t = x - 2;
        setCoords({ x: x, y: y });
        let tracer = props.tracers.find((e: any) => e.m.i === m + 1 && e.t.i === t + 1);
        if (tracer) {
            setCurrentClickedValue(tracer.value);
        } else {
            setCurrentClickedValue(-1);
        }
    }

    const [bg, setbg] = useState('blue');

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
            <input type="text" placeholder={currentClickedValue === -1 ? "Click on a value to edit" : currentClickedValue.toString()}
                onChange={(e) => {
                    let tracer = props.tracers.find((e: any) => e.m.i === coords.y - 1 && e.t.i === coords.x - 1);
                    // if the value is a number greater than or equal to 0, and less than or equal to 100 update the value of the clicked point
                    if (tracer && typeof parseFloat(e.target.value) === "number" && parseFloat(e.target.value) <= 100 && parseFloat(e.target.value) >= 0) {
                        tracer.updateValue(parseFloat(e.target.value));
                        props.screenSizes.updateSizes(props);
                    }
                }} />

            <ButtonGroup aria-label="Move Mode">
                <Button onClick={() => props.setMoveMode(!props.moveMode)}>{props.moveMode ? "Move Mode On" : "Move Mode: Off"}</Button>
            </ButtonGroup>

            <ButtonGroup aria-label="Data Control">
                <Button onClick={() => newPoint(props, true)}>New Row</Button>
                <Button onClick={() => newPoint(props, false)}>New Column</Button>
            </ButtonGroup>

            <ButtonGroup aria-label="Point Control">
                <Image src="/m.svg" width={40} height={40} draggable={true}
                    style={{
                        cursor: 'pointer',
                        marginRight: '1rem'
                    }}
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
                    style={{
                        cursor: 'pointer',
                        marginLeft: '1rem'
                    }}
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
                <Button onClick={() => sendFile(props, db, props.leftPanel.siteheader).then(() => { setbg('green') })} style={{ backgroundColor: bg }}>Save</Button>
                <Button onClick={() => saveFile(props)}>Download</Button>
            </ButtonGroup>
        </div>
    );
}

export function EditorContainer() {

    // const { theme, setTheme } = useTheme();
    // const screenSizes = useContext(ScreenSizesContext);
    // const leftPanel = useContext(LeftPanelContext);

    // const [props, setProps] = useState<any>({
    //     sheetState: [leftPanel.spreadsheet],
    //     bools: [false, false, false, false, false, false, theme === "dark"],
    //     leftPanel: leftPanel,
    //     ms: [],
    //     ts: [],
    //     tracers: [],
    //     areas: [],
    //     views: [],
    //     insights: [],
    //     site: "",
    //     sitelist: [""],
    //     window: null,
    //     screenSizes: screenSizes
    // });


    const { theme, setTheme } = useTheme();
    const [loading, setLoading] = useState(true);
    const screenSizes = useContext(ScreenSizesContext);
    const leftPanel = useContext(LeftPanelContext);
    const editorData = useContext(EditorContext);



    const [moveMode, setMoveMode] = useState(false);
    const [clickedLocation, setClickedLocation] = useState(new Vector3(0, 0, 0));

    function clickListener(e: any) {
        if (moveMode) {
            let i = getIntersects(e.clientX, e.clientY, props);
            if (i.length > 0) {
                setClickedLocation(i[0].point);
            }
        }
    }

    const [props, setProps] = useState<EditorProps>({
        sheetState: [leftPanel.spreadsheet],
        bools: [false, false, false, false, false, false, theme === "dark"],
        leftPanel: leftPanel,
        ms: editorData.ms,
        ts: editorData.ts,
        tracers: editorData.tracers,
        areas: editorData.areas,
        views: editorData.views,
        insights: editorData.insights,
        site: "",
        sitelist: [""],
        window: null,
        screenSizes: screenSizes,
        setProps: (props: EditorProps) => setProps(props),
        loading: loading,
        setLoading: setLoading,
        canvasDropListener: canvasDropListener,
        moveMode: moveMode,
        setMoveMode: setMoveMode,
        clickedLocation: clickedLocation,
        setClickedLocation: clickListener
    });

    function fixPos(pos: Vector3) {
        // y = -y
        return new Vector3(pos.x, pos.z, pos.y);
    }

    function setPositionOfSelectedPoint(pos: Vector3, props: EditorProps) {
        // get the selected point
        let [x, y, _x, _y] = props.leftPanel.getClicks();
        if (x != 0 && y != 0) {
            return; // we only want to move one point at a time
        } else if (x != 0) {
            // move the column
            let t = props.ts[x - 1];
            t.pos = fixPos(pos);
        } else if (y != 0) {
            // move the row
            let m = props.ms[y - 1];
            m.pos = fixPos(pos);
        }
    }


    useEffect(() => {
        setProps({
            sheetState: [leftPanel.spreadsheet],
            bools: [false, false, false, false, false, false, theme === "dark"],
            leftPanel: leftPanel,
            ms: editorData.ms,
            ts: editorData.ts,
            tracers: editorData.tracers,
            areas: editorData.areas,
            views: editorData.views,
            insights: editorData.insights,
            site: "",
            sitelist: [""],
            window: window,
            screenSizes: screenSizes,
            setProps: (props: EditorProps) => setProps(props),
            loading: loading,
            setLoading: setLoading,
            canvasDropListener: canvasDropListener,
            moveMode: moveMode,
            setMoveMode: setMoveMode,
            clickedLocation: clickedLocation,
            setClickedLocation: clickListener
        });

    }, [leftPanel, theme, screenSizes, loading, moveMode, clickedLocation]);

    useEffect(() => {
        //console.log("clicked location", clickedLocation);
        setPositionOfSelectedPoint(clickedLocation, props);
    }, [clickedLocation]);

    return (
        <Sidebar
            firstChild={
                <div>
                    <ViewportControl {...{ ...props, childOne: <EditorControl {...props} />, childTwo: <AreaControl {...props} /> }} />
                </div>
            }
            secondChild={
                <div>
                    {loading ? <div className="loading">Loading...</div> : null}
                    <Viewport {...props} />
                </div>
            }
        />
    );
};