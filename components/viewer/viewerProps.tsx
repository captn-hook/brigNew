"use client";
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

export interface Props {
    darkTheme: boolean;

    mode: ViewerMode;
    site: string;
    sitelist: string[];

    tracers: Tracer2d[];
    xPoints: Point2d[];
    yPoints: Point2d[];
    areas: Area[];
    groupds: Point2d[][];
    
    window: Window | undefined;
    screenSizes: ScreenSizes;
}

export function createProps(theme = false): Props {
    return {
        darkTheme: theme,
        mode: ViewerMode.Tracers,
        site: 'Example',
        sitelist: ['Example'],
        tracers: [],
        xPoints: [],
        yPoints: [],
        areas: [],
        groupds: [],
        window: undefined,
        screenSizes: new ScreenSizes()
    };
}

export const ViewerContext = React.createContext(createProps());