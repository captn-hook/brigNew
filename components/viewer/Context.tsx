import { useContext, createContext, useState, useEffect } from 'react';
import { useTheme } from "next-themes";
import { ScreenSizes } from './ScreenSizes';
import { Panel } from './Panel';

import { Point2d } from "./Point";
import { Tracer2d } from "./Tracer";
import { Area } from "./Area";

import { Sidebar } from "@/components/sidebar";
import { Viewport, ViewportControl } from "@/components/viewer/viewport";

export const ScreenSizesContext = createContext(new ScreenSizes());
export const LeftPanelContext = createContext(new Panel());

export interface Props {
    sheetState: string[];
    bools: boolean[];
    leftPanel: Panel;
    ms: Point2d[];
    ts: Point2d[];
    tracers: Tracer2d[];
    areas: Area[];
    views: string[];
    insights: string[];
    site: string;
    sitelist: string[];
    window: Window | null;
    screenSizes: ScreenSizes;
}

export interface EditorProps {
    sheetState: string[];
    bools: boolean[];
    leftPanel: Panel;
    ms: Point2d[];
    ts: Point2d[];
    tracers: Tracer2d[];
    areas: Area[];
    views: string[];
    insights: string[];
    site: string;
    sitelist: string[];
    window: Window | null;
    screenSizes: ScreenSizes;
    canvasDropListener: (e: React.DragEvent<HTMLCanvasElement>, props: EditorProps) => void | undefined;
    setTs: (ts: Point2d[]) => void;
    setMs: (ms: Point2d[]) => void;
}

export const ViewportContainer = () => {
    const { theme, setTheme } = useTheme();
    const screenSizes = useContext(ScreenSizesContext);
    const leftPanel = useContext(LeftPanelContext);

    const [props, setProps] = useState < Props > ({
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
                    <ViewportControl {...props} />
                </div>
            }
            secondChild={
                <Viewport {...props} />
            }
        />
    );
};