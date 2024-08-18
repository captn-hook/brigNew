'use client';
import { useState } from "react";
import { ScreenSizes } from "@/components/viewer/ScreenSizes";
import { Panel } from "@/components/viewer/Panel"
import { ScreenSizesContext, LeftPanelContext, ViewportS } from "@/components/viewer/Context";

export default function ViewerPage() {

	const screenSizes = new ScreenSizes(true);
	const leftPanel = new Panel();

	return (
		<ScreenSizesContext.Provider value={screenSizes}>
			<LeftPanelContext.Provider value={leftPanel}>
				<ViewportS></ViewportS>
			</LeftPanelContext.Provider>
		</ScreenSizesContext.Provider>
	);
}