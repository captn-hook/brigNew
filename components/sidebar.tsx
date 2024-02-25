"use client";
import React, { useRef, useState, useEffect } from 'react';
import { SidebarProps } from '@/types';

export const Sidebar = (props: SidebarProps) => {
    const initialWidth = localStorage.getItem('sidebarWidth') ? parseInt(localStorage.getItem('sidebarWidth')!) : 250;
    const [sidebarWidth, setSidebarWidth] = useState(initialWidth);
    const [dragging, setDragging] = useState(false);
    const dragHandler = useRef<HTMLDivElement>(null);

    const startDrag = () => {
        setDragging(true);
    };

    const doDrag = (e: MouseEvent) => {
        if (!dragging) return;
        setSidebarWidth(e.clientX);
    };

    const stopDrag = () => {
        setDragging(false);
    };

    useEffect(() => {
        if (dragging) {
            window.addEventListener('mousemove', doDrag);
            window.addEventListener('mouseup', stopDrag);
        } else {
            window.removeEventListener('mousemove', doDrag);
            window.removeEventListener('mouseup', stopDrag);
        }
        return () => {
            window.removeEventListener('mousemove', doDrag);
            window.removeEventListener('mouseup', stopDrag);
        };
    }, [dragging]);

    useEffect(() => {
        localStorage.setItem('sidebarWidth', sidebarWidth.toString());
    }, [sidebarWidth]);

    return (
        <div style={{ display: 'flex', flexDirection: 'row', ...props.style }} className={props.className}>
            <div style={{ flex: `0 0 ${sidebarWidth}px`, overflow: 'hidden' }}>
                {props.firstChild}
            </div>
            <div ref={dragHandler} onMouseDown={startDrag} style={{ cursor: 'col-resize', padding: '2px', background: dragging ? '#555' : '#888' }} />
            <div style={{ flex: '1 1 auto', overflow: 'auto' }}>
                {props.secondChild}
            </div>
        </div>
    );
};