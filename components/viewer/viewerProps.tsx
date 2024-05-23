import React from 'react';

import { ScreenSizes } from './ScreenSizes';
import { Area } from './Area';
import { Point2d } from './Point';
import { Tracer2d } from './Tracer';

export enum ViewerMode {
    Tracers,
    Areas,
    Groups
}

export enum CameraMode {
    Free,
    Fixed,
    Mixed
}

export interface Props {
    darkTheme: boolean;

    mode: ViewerMode;
    setMode?: (mode: ViewerMode) => void;
    nextMode?: () => void;

    site: string;
    setSite?: (site: string) => void;
    setSiteFromList?: (index: number) => void;

    sitelist: string[];
    setSitelist?: (sitelist: string[]) => void;
    pushToSitelist?: (site: string) => void;

    cameraMode: CameraMode;
    setCameraMode?: (mode: CameraMode) => void;
    nextCameraMode?: () => void;    

    tracers: Tracer2d[];
    setTracers?: (tracers: Tracer2d[]) => void;
    pushToTracers?: (tracer: Tracer2d) => void;
    popFromTracers?: () => void;
    removeTracer?: (index: number) => void;
    setTracer?: (index: number, tracer: Tracer2d) => void;

    xPoints: Point2d[];
    setXPoints?: (xPoints: Point2d[]) => void;
    pushToXPoints?: (point: Point2d) => void;
    popFromXPoints?: () => void;
    removeXPoint?: (index: number) => void;
    setXPoint?: (index: number, point: Point2d) => void;
    addRow?: () => void;
    deleteRow?: () => void;

    yPoints: Point2d[];
    setYPoints?: (yPoints: Point2d[]) => void;
    pushToYPoints?: (point: Point2d) => void;
    popFromYPoints?: () => void;
    removeYPoint?: (index: number) => void;
    setYPoint?: (index: number, point: Point2d) => void;
    addColumn?: () => void;
    deleteColumn?: () => void;
    
    areas: Area[];
    setAreas?: (areas: Area[]) => void;
    pushToAreas?: (area: Area) => void;
    popFromAreas?: () => void;
    removeArea?: (index: number) => void;
    setArea?: (index: number, area: Area) => void;

    groups: Point2d[][];
    setGroups?: (groups: Point2d[][]) => void;
    pushToGroups?: (group: Point2d[]) => void;
    popFromGroups?: () => void;
    removeGroup?: (index: number) => void;
    setGroup?: (index: number, group: Point2d[]) => void;

    insights: string[];
    setInsights?: (insights: string[]) => void;
    pushToInsights?: (insight: string) => void;
    popFromInsights?: () => void;
    removeInsight?: (index: number) => void;

    views: string[];
    setViews?: (views: string[]) => void;
    pushToViews?: (view: string) => void;
    popFromViews?: () => void;
    removeView?: (index: number) => void;

    showValues: boolean;
    setShowValues?: (showValues: boolean) => void;

    showTransparency: boolean;
    setShowTransparency?: (showTransparency: boolean) => void;
    
    window: Window | undefined;
    screenSizes: ScreenSizes;
}

export function createProps(theme = false): Props {
    return {
        darkTheme: theme,
        mode: ViewerMode.Tracers,
        site: 'Example',
        sitelist: ['Example'],
        cameraMode: CameraMode.Free,
        tracers: [],
        xPoints: [],
        yPoints: [],
        areas: [],
        groups: [],
        insights: [],
        views: [],
        showValues: false,
        showTransparency: false,
        window: undefined,
        screenSizes: new ScreenSizes()
    };
}

export const ViewerContext = React.createContext<Props | null>(null);