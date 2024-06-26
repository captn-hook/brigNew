'use client';
import { ScreenSizes } from "@/components/viewer/ScreenSizes";
import { Panel } from "@/components/viewer/Panel"
import { ScreenSizesContext, LeftPanelContext } from "@/components/viewer/Context";
import { EditorContainer } from '@/components/editor/editorContainer';

export default function EditorPage() {
	
	const screenSizes = new ScreenSizes();
	const leftPanel = new Panel();
	
	return (
		<ScreenSizesContext.Provider value={screenSizes}>
			<LeftPanelContext.Provider value={leftPanel}>
				<EditorContainer></EditorContainer>
			</LeftPanelContext.Provider>
		</ScreenSizesContext.Provider>
	);
}