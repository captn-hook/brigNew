import { Sidebar } from "@/components/sidebar";
import { Viewport, ViewportControl } from "@/components/viewer/viewport";
export default function ViewerPage() {
	return (
		<Sidebar
			className="h-screen"
			firstChild={
				<div>
					<ViewportControl />
				</div>
			}
			secondChild={
				<Viewport />
			}			
		/>
	);
}
