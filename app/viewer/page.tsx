"use client";
import { Sidebar } from "@/components/sidebar";
import { Viewport, ViewportControl } from "@/components/viewer/viewport";
import { ScreenSizes } from "@/components/viewer/ScreenSizes";
import { ScreenSizesContext } from "@/components/viewer/ScreenSizesContext";

export default function ViewerPage() {
	
	const screenSizes = new ScreenSizes();
	
	return (
		<ScreenSizesContext.Provider value={screenSizes}>
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
		</ScreenSizesContext.Provider>
	);
}
