import React, { useEffect, useRef } from "react";
import { ButtonGroup } from "@nextui-org/button";
import { SwitchButton, ThreeStateButton } from "./Button";
import { Props, EditorProps } from "./Context";
import * as Viewer from "./viewer";
import { Tracer2d } from "./Tracer";
import { Point2d } from "./Point";
import siteList from "./siteList";
import interpHash from "./interpHash";
import dropdListener from "./dropdListener";
import { userSites, auth } from "../auth";
import { stoplookin, storePos, windowResizeFunc, changeSceneBG } from "./listeners";

import "./canvas.css";
import { updateCam } from "./updateCam";

export const Viewport = (props: Props | EditorProps) => {

    var div3dRef = useRef<HTMLDivElement>(null);
    var webglRef = useRef<HTMLCanvasElement>(null);
    var canvas2dRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (props && props.window && div3dRef.current && canvas2dRef.current) {
            props.screenSizes.setViewerRefs(div3dRef.current, canvas2dRef.current, webglRef.current);
            //props.screenSizes.updateSizes();
            Viewer.open(props);
        }
    }, [props, div3dRef, canvas2dRef, webglRef]);

    useEffect(() => {
        window.addEventListener('resize', () => {
            if (props.window != null) {
                windowResizeFunc(props);
            }
        });
    }, [props]);

    useEffect(() => {
        window.addEventListener('hashchange', (e) => {
            if (props.window != null && props.leftPanel.dropd != null) {
                interpHash(props);
            }
        });
        
        if (props.window != null && props.leftPanel.dropd != null) {
            interpHash(props);
        }

    }, [props]);    

    //listen for theme change
    useEffect(() => {
        changeSceneBG(props);
    }, [props]);

    

    return (
        <div id="3d" className="viewport" ref={div3dRef}>
            <canvas className="webgl" id="threejs" ref={webglRef}/>
            <canvas className="tracers" id="2d" ref={canvas2dRef}
                onContextMenu={(e) => {
                    stoplookin(props);
                    e.preventDefault();
                }}
                onMouseDown={(e) => {
                    stoplookin(props);
                }}
                onWheel={(e) => {
                    stoplookin(props); //should be passive
                }}
                onClick={(e) => {
                    stoplookin(props);
                    if ('setClickedLocation' in props) {
                        props.setClickedLocation(e);
                    }
                }}
                onDragStart={(e) => {
                    // dont
                    stoplookin(props);
                    e.preventDefault();
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                }}
                onMouseUp={(e) => {
                    storePos(props);
                }}
                onDrop={(e) => {
                    e.preventDefault();
                    if ('canvasDropListener' in props) {
                        props.canvasDropListener(e, props); // idc abt this yodam ts error
                    }
                }} 
            />
        </div>
    );
}


export function ViewportControl(props: any) {
    const spreadsheetRef = useRef<HTMLCanvasElement>(null);
    const dropdownRef = useRef<HTMLSelectElement>(null);

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
        , [spreadsheetRef, props]);

    useEffect(() => {
        if (props && props.leftPanel && dropdownRef.current) {
            props.leftPanel.setDropdRef(dropdownRef.current);
        }
    }, [dropdownRef, props]);        

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user && dropdownRef.current && props) {
                userSites().then((sitelist: any) => {

                    for (let i = props.sitelist.length - 1; i >= 0; i--) {
                        props.sitelist.pop();
                    }
                    for (let i = 0; i < sitelist.length; i++) {
                        props.sitelist.push(sitelist[i]);
                    }

                    siteList(props);
                }).catch((error) => {
                    console.error(error);
                });
            } else {
                console.log("No user signed in");
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [dropdownRef, props]);

    const [sheetState, setSheetState] = React.useState(props.leftPanel.spreadsheet);

    return (
        <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', alignItems: 'center', gap: '1rem' }} className="viewportControl">

            <div id="siteButtons" title="Site Dropdown">
                <label id="tx" style={{ marginRight: '1rem' }}>Choose a site:</label>
                <select name="sites" id="dropdown" title="Dropdown" style={{ marginRight: '1rem' }} ref={dropdownRef} onChange={(event) => {
                    dropdListener(event, props);
                }}>
                </select>
            </div>

            <ButtonGroup id="switchDisplayType">
                <ThreeStateButton id="swapper" title="Switch Display Type"
                    onPress={async () => {
                        props.leftPanel.next();
                        setSheetState(props.leftPanel.spreadsheet);
                    }} 
                    text1="Both"
                    text2="Tracers"
                    text3="Areas"
                ></ThreeStateButton>
            </ButtonGroup>

            <ButtonGroup id="bug1">
                <SwitchButton id="valueBtnS" title="Show values"
                    onPress={
                        async () => {
                            props.bools[0] = !props.bools[0]
                        }
                    }
                    text1="Show Values"
                    text2="Hide Values"
                ></SwitchButton>
                <SwitchButton id="opacityBtnS" title="Toggle Transparency"
                    onPress={
                        async () => {
                            props.bools[1] = !props.bools[1]

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
                                props.ms.forEach((m: Point2d) => {
                                    if (m.i >= miny && m.i <= y) {
                                        m.visible = !m.visible;
                                    }
                                })
                            }

                            if (miny == 0) {
                                props.ts.forEach((d: Point2d) => {
                                    if (d.i >= minx && d.i <= x) {
                                        d.visible = !d.visible;
                                    }
                                })
                            }

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
                                //console.log("combo -> locked");
                                Viewer.controls.enabled = false;
                                props.leftPanel.camFree = true;
                                if (props.screenSizes.canvas2d.current) {
                                    props.screenSizes.canvas2d.current.style.pointerEvents = "none";
                                }

                            } else if (!Viewer.controls.enabled && props.leftPanel.camFree) {
                                // locked -> free
                                //console.log("locked -> free");
                                Viewer.controls.enabled = true;
                                props.leftPanel.camFree = false;
                                if (props.screenSizes.canvas2d.current) {
                                    props.screenSizes.canvas2d.current.style.pointerEvents = "auto";
                                }
                            } else {
                                //console.log("combo -> free");
                                // free -> combo
                                Viewer.controls.enabled = true;
                                props.leftPanel.camFree = true;
                                if (props.screenSizes.canvas2d.current) {
                                    props.screenSizes.canvas2d.current.style.pointerEvents = "none";
                                }
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

                            props.ms.forEach((m: Point2d) => {
                                m.visible = !props.bools[4];
                            })
                            props.ts.forEach((t: Point2d) => {
                                t.visible = !props.bools[4];
                            })
                            props.tracers.forEach((t: Tracer2d) => {
                                t.visible = !props.bools[4];
                            })

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
                                props.ms.forEach((m: Point2d) => {
                                    if (m.i >= miny && m.i <= y) {
                                        m.visible = !props.bools[5];
                                    }
                                })
                            }

                            if (miny == 0) {
                                props.ts.forEach((d: Point2d) => {
                                    if (d.i >= minx && d.i <= x) {
                                        d.visible = !props.bools[5];
                                    }
                                })
                            }

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
                        updateCam(props);
                    }}
                    onClick={(e) => {
                        props.leftPanel.place(e, props);
                    }}
                    onMouseMove={(e) => {
                        props.leftPanel.move(e);
                    }}
                ></canvas>
            </div>
            { sheetState == 'spreadsheet' ?
                props.childOne : null
            }
            { sheetState == 'areas' ?
                props.childTwo : null
            }
            <div id="texcontainer" style={{ display: 'none' }}>
                <textarea id="textbox" style={{ backgroundColor: 'grey', color: 'white' }} readOnly></textarea>
            </div>
        </div >
    );
}