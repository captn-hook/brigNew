"use client";
import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Viewport, ViewportControl } from "@/components/viewer/viewport";
import { ViewerContext, createProps,  Props} from "./viewerProps";
import { useTheme } from "next-themes";

export const VPage = () => {
    const { theme } = useTheme();
    const [props, setProps] = useState<Props | null>(null);

    useEffect(() => {
        // Create a new Props object
        const newProps = createProps(theme === "dark");

        // Set the window of the props once we have it
        newProps.window = window;

        // Set the props state
        setProps(newProps);
    }, [theme]);
    
    if (!props) return null;

    return (
        <ViewerContext.Provider value={props}>
            <Sidebar
                firstChild={
                    <div>
                        <ViewportControl />
                    </div>
                }
                secondChild={
                    <Viewport />
                }           
            />
        </ViewerContext.Provider>
    );
}