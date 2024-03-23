"use client";
import React, { useEffect, useState, useRef } from "react";
import { Button, ButtonGroup } from "@nextui-org/button";
import { open } from "./viewer";
import { ViewerContext } from "./viewerProps";

import "./canvas.css";

export const Viewport = () => {
    const props = React.useContext(ViewerContext);

    const div3dRef = useRef<HTMLDivElement>(null);
    const canvas2dRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (props.window && div3dRef.current && canvas2dRef.current) {
            props.screenSizes.setViewerRefs(div3dRef.current, canvas2dRef.current);
            //props.screenSizes.updateSizes();
            open(props);
        }
    }
        , [props, div3dRef, canvas2dRef]);

    return (
        <div id="3d" className="viewport" ref={div3dRef}>
            <canvas className="webgl" id="threejs"></canvas>
            <canvas className="tracers" id="2d" ref={canvas2dRef}></canvas>
        </div>
    );
}

export const ViewportControl = () => {
    // const screenSizes = React.useContext(ScreenSizesContext);
    const props = React.useContext(ViewerContext);

    const spreadsheetRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(() => {
        if (spreadsheetRef.current) {
            props.screenSizes.setSpreadsheetRef(spreadsheetRef.current);
            //screenSizes.updateSizes();
        }
    }
        , [spreadsheetRef]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
            <ButtonGroup id="nav">
                <Button id="viewer">Viewer</Button>
                <Button id="editor">Editor</Button>
                <Button id="index">Home</Button>
                <Button id="account">Account</Button>
            </ButtonGroup>

            <div id="siteButtons" title="Site Dropdown">
                <label id="tx">Choose a site:</label>
                <select name="sites" id="dropdown" title="Dropdown">
                    <option value="Empty">Example</option>
                </select>
                <Button id="groups" title="Groups Menu">Groups</Button>
            </div>

            <ButtonGroup id="bug1">
                <Button id="valueBtnS" title="Show values">Show values</Button>
                <Button id="opacityBtnS" title="Toggle Transparency">Transparent</Button>
                <Button id="flipBtn" title="Flip selection visibility">Flip ◐</Button>
                <Button id="camBtn" title="Change camera control mode">Free 📹</Button>
                <Button id="resetBtn" title="Toggle all visibility">Toggle all ❎</Button>
                <Button id="toggleBtn" title="Toggle selection visibility">Toggle ◧</Button>
            </ButtonGroup>
            <ButtonGroup id="bug2" style={{ display: 'none' }}>
                <Button id="valueBtnG" title="Show values">Show values</Button>
                <Button id="opacityBtnG" title="Toggle Transparency">Transparent</Button>
            </ButtonGroup>
            <ButtonGroup id="bug3" style={{ display: 'none' }}>
                <Button id="valueBtnA" title="Show values">Show values</Button>
                <Button id="opacityBtnA" title="Toggle Transparency">Transparent</Button>
            </ButtonGroup>
            
            <div id="panel">
                <canvas id="spreadsheet" ref={spreadsheetRef}></canvas>
            </div>
            <div id="texcontainer" style={{ display: 'none' }}>
                <textarea id="textbox" style={{ backgroundColor: 'grey', color: 'white' }} readOnly></textarea>
            </div>
        </div >
    );
}