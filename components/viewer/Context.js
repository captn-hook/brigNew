"use client";
import React from 'react';
import { ScreenSizes } from './ScreenSizes';
import { Panel } from './Panel';

export const ScreenSizesContext = React.createContext(new ScreenSizes());
export const LeftPanelContext = React.createContext(new Panel());