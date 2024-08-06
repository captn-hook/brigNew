'use client';
import React, { useState, useContext } from 'react';
import { useTheme } from "next-themes";
import { ScreenSizes } from "@/components/viewer/ScreenSizes";
import { Panel } from "@/components/viewer/Panel"
import { ScreenSizesContext, LeftPanelContext, EditorContext, EditorData } from "@/components/viewer/Context";
import { EditorContainer } from '@/components/editor/editorContainer';
import { EditorProps } from "@/components/viewer/Context";

export default function EditorPage() {

    const screenSizes = new ScreenSizes();
    const leftPanel = new Panel();
    const editorData = new EditorData();

    return (

        <EditorContext.Provider value={editorData}>
            <ScreenSizesContext.Provider value={screenSizes}>
                <LeftPanelContext.Provider value={leftPanel}>
                    <EditorContainer></EditorContainer>
                </LeftPanelContext.Provider>
            </ScreenSizesContext.Provider >
        </EditorContext.Provider>
    );
}