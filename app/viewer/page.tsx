import { ScreenSizes } from "@/components/viewer/ScreenSizes";
import { Panel } from "@/components/viewer/Panel"
import { ScreenSizesContext, LeftPanelContext, ViewportContainer } from "@/components/viewer/Context";

export default function ViewerPage() {
	
	const screenSizes = new ScreenSizes();
	const leftPanel = new Panel();
	
	return (
		<ScreenSizesContext.Provider value={screenSizes}>
			<LeftPanelContext.Provider value={leftPanel}>
				<ViewportContainer></ViewportContainer>
			</LeftPanelContext.Provider>
		</ScreenSizesContext.Provider>
	);
}