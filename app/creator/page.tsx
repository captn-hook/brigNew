import { Sidebar } from "@/components/sidebar";
import { Viewport, ViewportControl } from "@/components/viewport";
import { SpreadSheet, SpreadSheetControl, SpreadSheetEditor} from "@/components/spreadsheet";
import { CreatorTools } from "@/components/creatorTools";

export default function CreatorPage() {
	return (
		<Sidebar
			className="h-screen"
			firstChild={
				<div>
					<CreatorTools />
					<SpreadSheet />
				</div>
			}
			secondChild={
				<Viewport />
			}			
		/>
	);
}
