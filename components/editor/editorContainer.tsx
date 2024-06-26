import { Props, LeftPanelContext, ScreenSizesContext } from "../viewer/Context";
import { useContext, useState, useEffect } from 'react';
import { useTheme } from "next-themes";
import { Sidebar } from "@/components/sidebar";
import { Viewport, ViewportControl } from "@/components/viewer/viewport";
import { Button, ButtonGroup } from '@nextui-org/button';
import { Vector3 } from 'three';
import { Point2d } from '../viewer/Point';
import { Tracer2d } from '../viewer/Tracer';

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
    console.log(temp.length, temp2.length, props.ms.length);
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


export default function EditorControl(props: Props) {
    
    const leftPanel = useContext(LeftPanelContext);

    const [currentClickedValue, setCurrentClickedValue] = useState( -1 );
    const [index, setIndex] = useState( -1 );

    leftPanel.clickCallback = (x: number, y: number) => {
        console.log("clicked", x, y);
        // get the tracer at the clicked position from props.ts and props.ms -> props.tracers[index]
        // two dimensions to 1d array
        const m = y - 2;
        const t = x - 2;
        const index = m * props.ts.length + t;
        setIndex(index);
        setCurrentClickedValue(props.tracers[index].value);
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
            <input type="text" placeholder={ currentClickedValue === -1 ? "Click on a point to edit" : currentClickedValue.toString() } 
                onChange={(e) => {
                    // if the value is a number greater than or equal to 0, and less than or equal to 100 update the value of the clicked point
                    if (index != -1 && typeof parseFloat(e.target.value) === "number" && parseFloat(e.target.value) <= 100 && parseFloat(e.target.value) >= 0) {
                        console.log("set index", index, "to", parseFloat(e.target.value));
                        props.tracers[index].updateValue(parseFloat(e.target.value));
                        props.screenSizes.updateSizes(props);
                    }
                }} />
            <ButtonGroup aria-label="Data Control">
                <Button onClick={() => newPoint(props, true)}>New Row</Button>
                <Button onClick={() => newPoint(props, false)}>New Column</Button>
            </ButtonGroup>
            <ButtonGroup aria-label="Data Control">
                <Button onClick={() => console.log("delete row")}>Delete Row</Button>
                <Button onClick={() => console.log("delete column")}>Delete Column</Button>
            </ButtonGroup>
            <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <h2>Point Control</h2>
                <ButtonGroup aria-label="Point Control">
                    <Button onClick={() => console.log("new m point")}>New M Point</Button>
                    <Button onClick={() => console.log("new t point")}>New T Point</Button>
                </ButtonGroup>
                <ButtonGroup aria-label="Point Control">
                    <Button onClick={() => console.log("delete m point")}>Delete M Point</Button>
                    <Button onClick={() => console.log("delete t point")}>Delete T Point</Button>
                </ButtonGroup>
            </div>
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


    return (
        <Sidebar
            firstChild={
                <div>
                    <ViewportControl {...{ ...props, childOne: <EditorControl {...props} />, childTwo: <AreaControl {...props} /> }} />
                </div>
            }
            secondChild={
                <Viewport {...props} />
            }
        />
    );
};