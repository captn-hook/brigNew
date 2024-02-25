export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "Poppy Data Visualization",
	description: "See insights into your spaces and their air quality",
	navItems: [
		{
			label: "Home",
			href: "/",
		},
		{
			label: "Viewer",
			href: "/viewer",
		},
		{
			label: "Editor",
			href: "/editor",
		},
		{
			label: "Creator",
			href: "/creator",
		},
		{
			label: "Manager",
			href: "/manager",
		}
	],
	navMenuItems: [
		{
			label: "Profile",
			href: "/profile",
		},
		{
			label: "Settings",
			href: "/settings",
		},
		{
			label: "Help & Feedback",
			href: "/help-feedback",
		},
		{
			label: "Logout",
			href: "/logout",
		},
	],
	links: {
		home: "https://www.poppy.com/"
	},
};
