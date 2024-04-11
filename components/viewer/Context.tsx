"use client";
import React, { useState, useEffect } from 'react';
import { useTheme } from "next-themes";
import { ScreenSizes } from './ScreenSizes';
import { Panel } from './Panel';

import { Point2d } from "./Point";
import { Tracer2d } from "./Tracer";

import { Sidebar } from "@/components/sidebar";
import { Viewport, ViewportControl } from "@/components/viewer/viewport";

export const ScreenSizesContext = React.createContext(new ScreenSizes());
export const LeftPanelContext = React.createContext(new Panel());

export interface Props {
    darkTheme: boolean;
    //doVals: boolean;
    //alpha: boolean;
    //camFree: boolean;
    bools: boolean[];
    leftPanel: Panel;
    ms: Point2d[];
    ts: Point2d[];
    tracers: Tracer2d[];
    site: string;
    sitelist: string[];
    window: Window | undefined;
    screenSizes: ScreenSizes;
}

export const ViewportContainer = () => {
    const { theme, setTheme } = useTheme();
    const screenSizes = React.useContext(ScreenSizesContext);
    const leftPanel = React.useContext(LeftPanelContext);

    const [props, setProps] = useState < Props > ({
        darkTheme: theme === "dark",
        //doVals: false,
        //alpha: false,
        //camFree: false,
        bools: [false, false, false],
        leftPanel: leftPanel,
        ms: [],
        ts: [],
        tracers: [],
        site: "default",
        sitelist: ["default"],
        window: undefined,
        screenSizes: screenSizes
    });

    useEffect(() => {
        setProps({
            darkTheme: theme === "dark",
            //doVals: false,
            //alpha: false,
            //camFree: false,
            bools: [false, false, false],
            leftPanel: leftPanel,
            ms: [],
            ts: [],
            tracers: [],
            site: "default",
            sitelist: ["default"],
            window: window,
            screenSizes: screenSizes
        });
    }, [theme]);

    return (
        <Sidebar
            firstChild={
                <div>
                    <ViewportControl {...props} />
                </div>
            }
            secondChild={
                <Viewport {...props} />
            }
        />
    );
};