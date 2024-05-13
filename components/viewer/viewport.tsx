import React, { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup } from "@nextui-org/button";
import { SwitchButton, ThreeStateButton } from "./Button";
import { FlipButton, CamButton, ResetButton, ToggleButton, GroupButton } from "./Buttons";
import { open } from "./viewer";
import { Props } from "./Context";
import * as Viewer from "./viewer";
import { ViewerContext, ViewerMode } from "./viewerProps";
import { Tracer2d } from "./Tracer";
import { Point2d } from "./Point";

import "./canvas.css";

export const Viewport = (props: Props) => {

    const div3dRef = useRef<HTMLDivElement>(null);
    const webglRef = useRef<HTMLCanvasElement>(null);
    const canvas2dRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (props && props.window && div3dRef.current && canvas2dRef.current) {
            props.screenSizes.setViewerRefs(div3dRef.current, canvas2dRef.current, webglRef.current);
            //props.screenSizes.updateSizes();
            Viewer.open(props);
        }

        window.addEventListener('resize', () => {
            if (props.window != null) {
                Viewer.windowResizeFunc(props);
            }
        });
    }
        , [props, div3dRef, canvas2dRef]);

    //listen for theme change
    useEffect(() => {
        Viewer.changeSceneBG(props);
    }, [props.bools[6]]);

    return (
        <div id="3d" className="viewport" ref={div3dRef}>
            <canvas className="webgl" id="threejs" ref={webglRef}></canvas>
            <canvas className="tracers" id="2d" ref={canvas2dRef}
                onContextMenu={(e) => {
                    Viewer.stoplookin(props);
                    e.preventDefault();
                }}
                onMouseDown={(e) => {
                    Viewer.stoplookin(props);
                }}
                onWheel={(e) => {
                    Viewer.stoplookin(props); //should be passive
                }}
                onClick={(e) => {
                    Viewer.stoplookin(props);
                    Viewer.storePos(props);
                }}
            />
        </div>
    );
}

type BoolButtonProps = {
    bool: boolean;
    setter: React.Dispatch<React.SetStateAction<boolean>>;
    textFalse: string;
    textTrue: string;
    title?: string;
};

const BoolButton = ({ bool, setter, textFalse, textTrue, title = 'Title' }: BoolButtonProps) => {
    const handleClick = () => {
        setter(prevBool => !prevBool);
    }
    return (
        <Button onClick={handleClick} title={title}>
            {bool ? textFalse : textTrue}
        </Button>
    );
}

export const ViewportControl = (props: Props) => {
    const spreadsheetRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (spreadsheetRef.current && props) {
            props.screenSizes.setSpreadsheetRef(spreadsheetRef.current);
            //screenSizes.updateSizes();
            props.leftPanel.setPanelRef(spreadsheetRef.current);

            props.leftPanel.canvas.oncontextmenu = () => false;
            // props.leftPanel.canvas.addEventListener('mousedown', props.leftPanel.clicks.bind(props.leftPanel));
            // props.leftPanel.canvas.addEventListener('click', props.leftPanel.place.bind(props.leftPanel));
            // props.leftPanel.canvas.addEventListener('mousemove', props.leftPanel.move.bind(props.leftPanel));
        }
    }
        , [spreadsheetRef]);

    return (
        <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>

            <div id="siteButtons" title="Site Dropdown">
                <label id="tx" style={{ marginRight: '1rem' }}>Choose a site:</label>
                <select name="sites" id="dropdown" title="Dropdown" style={{ marginRight: '1rem' }}>
                    <option value="Empty">Example</option>
                </select>
                <Button style={{display: 'none'}} size="sm" id="groups" title="Groups Menu" onPress={() => GroupButton(props.leftPanel)}>Groups</Button>
            </div>

            <ButtonGroup id="bug1">
                <SwitchButton id="valueBtnS" title="Show values"
                    onPress={
                        async () => {
                            props.bools[0] = !props.bools[0]
                            console.log('values', props.bools[0])
                        }
                    }
                    text1="Show Values"
                    text2="Hide Values"
                ></SwitchButton>
                <SwitchButton id="opacityBtnS" title="Toggle Transparency"
                    onPress={
                        async () => {
                            props.bools[1] = !props.bools[1]
                            console.log('opacity', props.bools[1])
                        }
                    }
                    text1="Transparent"
                    text2="Opaque"
                ></SwitchButton>
                <SwitchButton id="flipBtn" title="Flip selection visibility"
                    onPress={
                        async () => {
                            props.bools[2] = !props.bools[2]

                            //find the difference between click 1 and click 2
                            

                            let corv: number[] = props.leftPanel.getClicks();
                            let minx = corv[0];
                            let miny = corv[1];
                            let x = corv[2];
                            let y = corv[3];
                            
                            props.tracers.forEach((t: Tracer2d) => {
                                const tPoint = t.t as unknown as Point2d;
                                const mPoint = t.m as unknown as Point2d; //fuck typescript
                                if (tPoint.i >= minx && tPoint.i <= x && mPoint.i >= miny && mPoint.i <= y) {
                                    t.visible = !t.visible
                                }
                            })

                            if (minx == 0) {
                                props.ms.forEach((m) => {
                                    if (m.i >= miny && m.i <= y) {
                                        m.visible = !m.visible;
                                    }
                                })
                            }

                            if (miny == 0) {
                                props.ts.forEach((d) => {
                                    if (d.i >= minx && d.i <= x) {
                                        d.visible = !d.visible;
                                    }
                                })
                            }
                            console.log('flip', props.bools[2])
                        }
                    }
                    text1="Flip ◑"
                    text2="Flip ◐"
                ></SwitchButton>
            </ButtonGroup>
            <ButtonGroup id="bug1">
                <ThreeStateButton id="camBtn" title="Camera Mode"
                    onPress={
                        async () => {

                            //combo = controls.enabled = true, camFree = true
                            //locked = controls.enabled = false, camFree = true
                            //free = controls.enabled = true, camFree = false
                            if (Viewer.controls.enabled && props.leftPanel.camFree) {
                                // combo -> locked
                                Viewer.controls.enabled = false;
                                props.leftPanel.camFree = true; 
                            } else if (!Viewer.controls.enabled && props.leftPanel.camFree) {
                                // locked -> free
                                Viewer.controls.enabled = true;
                                props.leftPanel.camFree = false;
                            } else {
                                // free -> combo
                                Viewer.controls.enabled = true;
                                props.leftPanel.camFree = true;
                            }                               

                        }
                    }
                    text1="Combo 🎥"
                    text2="Locked 📷"
                    text3="Free 📹"
                ></ThreeStateButton>
                <SwitchButton id="resetBtn" title="Toggle all visibility"
                    onPress={
                        async () => {
                            props.bools[4] = !props.bools[4]

                            props.ms.forEach((m) => {
                                m.visible = !props.bools[4];
                            })
                            props.ts.forEach((t) => {
                                t.visible = !props.bools[4];
                            })
                            props.tracers.forEach((t) => {
                                t.visible = !props.bools[4];
                            })

                            console.log('reset', props.bools[4])
                        }
                    }
                    text1="Toggle all ✔"
                    text2="Toggle all ✘"
                ></SwitchButton>
                <SwitchButton id="toggleBtn" title="Toggle selection visibility"
                    onPress={
                        async () => {
                            props.bools[5] = !props.bools[5]

                            //find the difference between click 1 and click 2
                            let corv: number[] = props.leftPanel.getClicks(); // i hate typescript
                            let minx = corv[0];
                            let miny = corv[1];
                            let x = corv[2];
                            let y = corv[3];

                            props.tracers.forEach((t: Tracer2d) => {
                                const tPoint = t.t as unknown as Point2d;
                                const mPoint = t.m as unknown as Point2d; //fuck typescript
                                if (tPoint.i >= minx && tPoint.i <= x && mPoint.i >= miny && mPoint.i <= y) {
                                    t.visible = !props.bools[5];
                                }
                            });

                            if (minx == 0) {
                                props.ms.forEach((m) => {
                                    if (m.i >= miny && m.i <= y) {
                                        m.visible = !props.bools[5];
                                    }
                                })
                            }

                            if (miny == 0) {
                                props.ts.forEach((d) => {
                                    if (d.i >= minx && d.i <= x) {
                                        d.visible = !props.bools[5];
                                    }
                                })
                            }

                            console.log('toggle', props.bools[5])
                        }
                    }
                    text1="Toggle ◨"
                    text2="Toggle ◧"
                ></SwitchButton>
            </ButtonGroup>

            <div id="panel" className="panel">
                <canvas id="spreadsheet" ref={spreadsheetRef} className="spreadsheet"
                    onMouseDown={(e) => {
                        props.leftPanel.clicks(e);
                    }}
                    onClick={(e) => {
                        props.leftPanel.place(e, props);
                    }}
                    onMouseMove={(e) => {
                        props.leftPanel.move(e);
                    }}
                ></canvas>
            </div>
            <div id="texcontainer" style={{ display: 'none' }}>
                <textarea id="textbox" style={{ backgroundColor: 'grey', color: 'white' }} readOnly></textarea>
            </div>
        </div >
    );
}