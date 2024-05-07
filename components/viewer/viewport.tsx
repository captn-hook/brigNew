"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup } from "@nextui-org/button";
import * as Viewer from "./viewer";
import { ViewerContext, ViewerMode } from "./viewerProps";

import "./canvas.css";

export const Viewport = () => {
    const props = React.useContext(ViewerContext);

    const div3dRef = useRef<HTMLDivElement>(null);
    const canvas2dRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (props && props.window && div3dRef.current && canvas2dRef.current) {
            props.screenSizes.setViewerRefs(div3dRef.current, canvas2dRef.current);
            //props.screenSizes.updateSizes();
            Viewer.open(props);
        }

        window.addEventListener('resize', () => {
            Viewer.windowResizeFunc(props);
        } );
    }
        , [props, div3dRef, canvas2dRef]);

    return (
        <div id="3d" className="viewport" ref={div3dRef}>
            <canvas className="webgl" id="threejs"></canvas>
            <canvas className="tracers" id="2d" ref={canvas2dRef}></canvas>
        </div>
    );
}

type BoolButtonProps = {
    bool: boolean;
    setter: React.Dispatch<React.SetStateAction<boolean>>;
    textFalse: string;
    textTrue: string;
    title?: string;
  };
  
const BoolButton = ({ bool, setter, textFalse, textTrue, title = 'Title'}: BoolButtonProps) => {
    const handleClick = () => {
        setter(prevBool => !prevBool);
    }
    return (
        <Button onClick={handleClick} title={title}>
            {bool ? textFalse : textTrue}
        </Button>
    );
}

export const ViewportControl: React.FC<{ setShowTransparency: React.Dispatch<React.SetStateAction<boolean>>, setShowValues: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setShowTransparency, setShowValues }) => {
    // const screenSizes = React.useContext(ScreenSizesContext);
    const props = React.useContext(ViewerContext);

    const spreadsheetRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (spreadsheetRef.current && props) {
            props.screenSizes.setSpreadsheetRef(spreadsheetRef.current);
            //screenSizes.updateSizes();
        }
    }
        , [spreadsheetRef]);

    return (
        <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <ButtonGroup id="nav" style={{ flexWrap: 'wrap' }}>
                <Button id="viewer">Viewer</Button>
                <Button id="editor">Editor</Button>
                <Button id="index">Home</Button>
                <Button id="account">Account</Button>
            </ButtonGroup>

            <div id="siteButtons" title="Site Dropdown">
                <label id="tx" style={{ marginRight: '1rem' }}>Choose a site:</label>
                <select name="sites" id="dropdown" title="Dropdown" style={{ marginRight: '1rem' }}>
                    <option value="Empty">Example</option>
                </select>
                <Button id="groups" title="Groups Menu">Groups</Button>
            </div>
            {props && (
                <ButtonGroup>
                    <BoolButton bool={props.showValues} setter={setShowValues!} textFalse="Show Values" textTrue="Hide Values" title="Toggle Values" />
                    <BoolButton bool={props.showTransparency} setter={setShowTransparency!} textFalse="Opaque" textTrue="Transparent" title="Opaque" />
                </ButtonGroup>
            )}
            {props && props.mode === ViewerMode.Tracers && (
                <ButtonGroup>
                    <Button id="flipBtn" title="Flip selection visibility">Flip ◐</Button>
                    <Button id="camBtn" title="Change camera control mode">Free 📹</Button>
                    <Button id="resetBtn" title="Toggle all visibility">Toggle all ❎</Button>
                    <Button id="toggleBtn" title="Toggle selection visibility">Toggle ◧</Button>
                </ButtonGroup>
            )}

            <div id="panel">
                <canvas id="spreadsheet" ref={spreadsheetRef}></canvas>
            </div>
            <div id="texcontainer" style={{ display: 'none' }}>
                <textarea id="textbox" style={{ backgroundColor: 'grey', color: 'white' }} readOnly></textarea>
            </div>
        </div >
    );
}