import { Sidebar } from "@/components/sidebar";
import { Viewport, ViewportControl } from "@/components/viewer/viewport";
import { SpreadSheet, SpreadSheetControl, SpreadSheetEditor} from "@/components/spreadsheet";
import { EditorTools } from "@/components/editorTools";

export default function EditorPage() {
	return (
		<Sidebar
			className="h-screen"
			firstChild={
				<div>
					<ViewportControl />
					<SpreadSheetControl />
					<SpreadSheet />
					<SpreadSheetEditor />
					<EditorTools />
				</div>
			}
			secondChild={
				<Viewport />
			}			
		/>
	);
}
