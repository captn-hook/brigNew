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
    bools: boolean[];
    leftPanel: Panel;
    ms: Point2d[];
    ts: Point2d[];
    tracers: Tracer2d[];
    views: string[];
    insights: string[];
    site: string;
    sitelist: string[];
    window: Window | null;
    screenSizes: ScreenSizes;
}

export const ViewportContainer = () => {
    const { theme, setTheme } = useTheme();
    const screenSizes = React.useContext(ScreenSizesContext);
    const leftPanel = React.useContext(LeftPanelContext);

    const [props, setProps] = useState < Props > ({
        bools: [false, false, false, false, false, false, theme === "dark"],
        leftPanel: leftPanel,
        ms: [],
        ts: [],
        tracers: [],
        views: [],
        insights: [],
        site: "",
        sitelist: [""],
        window: null,
        screenSizes: screenSizes
    });

    useEffect(() => {
        setProps({
            bools: [false, false, false, false, false, false, theme === "dark"],
            leftPanel: leftPanel,
            ms: [],
            ts: [],
            tracers: [],
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
                    <ViewportControl {...props} />
                </div>
            }
            secondChild={
                <Viewport {...props} />
            }
        />
    );
};