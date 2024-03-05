"use client";
import React, { useEffect, useState } from "react";
import { Button, ButtonGroup } from "@nextui-org/button";
import { open } from "./viewer";
import { useTheme } from "next-themes";

interface Props {
    darkTheme: boolean;
    site: string;
    sitelist: string[];
    window: Window | undefined;
}

export const Viewport = () => {
    const { theme, setTheme } = useTheme();

    const [props, setProps] = useState<Props>({
        darkTheme: theme === "dark",
        site: "default",
        sitelist: ["default"],
        window: undefined,
    });

    React.useEffect(() => {
        setProps({
            darkTheme: theme === "dark",
            site: "default",
            sitelist: ["default"],
            window: window,
        });
    }
        , [theme]);

    useEffect(() => {
        if (props.window) {
            open(props);
        }
    }
        , [props]);

    return (
        <div>
            <div id="panel" style={{ position: 'relative' }}>
                <canvas className="webgl" id="3d"></canvas>
                <canvas style={{ position: 'relative' }} id="2d"></canvas>
            </div>
        </div>
    );
}

export const ViewportControl = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
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
                <canvas id="spreadsheet"></canvas>
            </div>
            <div id="texcontainer" style={{ display: 'none' }}>
                <textarea id="textbox" style={{ backgroundColor: 'grey', color: 'white' }} readOnly></textarea>
            </div>
        </div >
    );
}
