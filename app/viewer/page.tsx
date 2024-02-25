import { Sidebar } from "@/components/sidebar";
import { Viewport, ViewportControl } from "@/components/viewport";
import { SpreadSheet, SpreadSheetControl} from "@/components/spreadsheet";

export default function ViewerPage() {
	return (
		<Sidebar
			className="h-screen"
			firstChild={
				<div>
					<ViewportControl />
					<SpreadSheetControl />
					<SpreadSheet />
				</div>
			}
			secondChild={
				<Viewport />
			}			
		/>
	);
}
