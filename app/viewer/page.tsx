"use client";
import { Sidebar } from "@/components/sidebar";
import { Viewport, ViewportControl } from "@/components/viewer/viewport";
import { ScreenSizes } from "@/components/viewer/ScreenSizes";
import { Panel } from "@/components/viewer/Panel"
import { ScreenSizesContext, LeftPanelContext } from "@/components/viewer/Context";

export default function ViewerPage() {
	
	const screenSizes = new ScreenSizes();
	const leftPanel = new Panel();
	
	return (
		<ScreenSizesContext.Provider value={screenSizes}>
			<LeftPanelContext.Provider value={leftPanel}>
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
			</LeftPanelContext.Provider>
		</ScreenSizesContext.Provider>
	);
}
