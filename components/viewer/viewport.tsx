"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup } from "@nextui-org/button";
import { SwitchButton, ThreeStateButton } from "./Button";
import { FlipButton, CamButton, ResetButton, ToggleButton, GroupButton } from "./Buttons";
import { open } from "./viewer";
import { Props } from "./Context";
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
            props.leftPanel.setPanelRef(spreadsheetRef.current);

            props.leftPanel.canvas.oncontextmenu = () => false;
            props.leftPanel.canvas.addEventListener('mousedown', props.leftPanel.clicks.bind(props.leftPanel));
            props.leftPanel.canvas.addEventListener('click', props.leftPanel.place.bind(props.leftPanel));
            props.leftPanel.canvas.addEventListener('mousemove', props.leftPanel.move.bind(props.leftPanel));
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
                <Button id="groups" title="Groups Menu" onPress={() => GroupButton(props.leftPanel)}>Groups</Button>
            </div>

            <ButtonGroup id="bug1">
                <SwitchButton id="valueBtnS" title="Show values"
                    onPress={
                        async () => {
                            props.bools[0] = !props.bools[0]
                            console.log('values', props.bools[0])
                        }
                    }
                    text1="Show Values"
                    text2="Hide Values"
                ></SwitchButton>
                <SwitchButton id="opacityBtnS" title="Toggle Transparency"
                    onPress={
                        async () => {
                            props.bools[1] = !props.bools[1]
                            console.log('opacity', props.bools[1])
                        }
                    }
                    text1="Transparent"
                    text2="Opaque"
                ></SwitchButton>
                <SwitchButton id="flipBtn" title="Flip selection visibility"
                    onPress={
                        console.log('flip')
                    }
                    text1=""
                    text2=""
                >Flip ◐</SwitchButton>
                <SwitchButton id="camBtn" title="Change camera control mode"
                    onPress={
                        console.log('cam')
                    }
                    text1=""
                    text2=""
                >Free 📹</SwitchButton>
                <SwitchButton id="resetBtn" title="Toggle all visibility"
                    onPress={
                        console.log('reset')
                    }
                    text1=""
                    text2=""
                >Toggle all ❎</SwitchButton>
                <SwitchButton id="toggleBtn" title="Toggle selection visibility"
                    onPress={
                        console.log('toggle')
                    }
                    text1=""
                    text2=""
                >Toggle ◧</SwitchButton>
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