export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "Poppy Data Visualization",
	description: "See insights into your spaces and their air quality",
	navItems: [
		{
			label: "Viewer",
			href: "/viewer",
			tooltip: "View your data on a site",
		},
		{
			label: "Editor",
			href: "/editor",
			tooltip: "Edit your data on a site",
		},
		{
			label: "Creator",
			href: "/creator",
			tooltip: "Create a new site",
		},
		{
			label: "Manager",
			href: "/manager",
			tooltip: "Manage your sites",
		}
	],
	navMenuItems: [
		{
			label: "Account",
			href: "/account",
		},
		{
			label: "Admin",
			href: "/admin",
		},
		{
			label: "Help & Feedback",
			href: "/help-feedback",
		},
		{
			label: "Logout",
			href: "/log",
		},
	],
	links: {
		home: "https://www.poppy.com/"
	},
};
