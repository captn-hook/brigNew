export default function ViewerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
		<div style={{ width: '100%', height: '100%'}} >
			{children}
		</div>
    );
}