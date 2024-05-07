    "use client";
import React, { useRef, useState, useEffect } from 'react';
import { SidebarProps } from '@/types';

export const Sidebar = (props: SidebarProps) => {
    //const initialWidth = localStorage.getItem('sidebarWidth') ? parseInt(localStorage.getItem('sidebarWidth')!) : 250;
    // if (typeof localStorage !== 'undefined' && localStorage.getItem('sidebarWidth')) {
    //     var initialWidth = parseInt(localStorage.getItem('sidebarWidth')!);
    // } else {
    //     var initialWidth = 300;
    // }

    const [sidebarWidth, setSidebarWidth] = useState(300); // default to the server value
    const [dragging, setDragging] = useState(false);
    const dragHandler = useRef<HTMLDivElement>(null);

    const startDrag = () => {
        setDragging(true);
    };

    useEffect(() => {
        
        const doDrag = (e: MouseEvent) => {
            if (!dragging) return;
            setSidebarWidth(e.clientX);
        };
    
        const stopDrag = () => {
            //dispatch a resize event
            const event = new Event('resize');
            window.dispatchEvent(event);
            setDragging(false);
        };
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
        // update to the client value after the component is mounted
        if (typeof localStorage !== 'undefined' && localStorage.getItem('sidebarWidth')) {
            setSidebarWidth(parseInt(localStorage.getItem('sidebarWidth')!));
        }
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'row', ...props.style }} className={props.className}>
            <div style={{ flex: `0 0 ${sidebarWidth}px`, overflow: 'hidden' }} className='content-center'>
                {props.firstChild}
            </div>
            <div ref={dragHandler} onMouseDown={startDrag} style={{ cursor: 'col-resize', padding: '2px', background: dragging ? '#555' : '#888' }} />
            <div style={{ flex: '1 1 auto', overflow: 'auto' }}>
                {props.secondChild}
            </div>
        </div>
    );
};