"use client";
import React from "react";
import {
	Navbar as NextUINavbar,
	NavbarContent,
	NavbarMenu,
	NavbarMenuToggle,
	NavbarBrand,
	NavbarItem,
	NavbarMenuItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import { link as linkStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import NextLink from "next/link";
import clsx from "clsx";

import { ThemeSwitch } from "@/components/theme-switch";

import { PoppyIconSmall } from "@/components/images";

import { SmallAccountStatus } from "@/components/authClient";

import { auth, SignOutListener } from "@/components/auth";

import "./navbar.css";

import { usePathname } from 'next/navigation'

export const Navbar = () => {

	const [isMenuOpen, setIsMenuOpen] = React.useReducer((current) => !current, false);

	let navItems = auth.currentUser ? siteConfig.navItems : siteConfig.navItems.filter((item) => item.label == "Viewer");
	let navMenuItems = auth.currentUser ? siteConfig.navMenuItems : [];

	const [signedIn, setSignedIn] = React.useState(false);

	React.useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				setSignedIn(true);
			} else {
				setSignedIn(false);
			}
		});
	}, []);
	
	if (usePathname().includes("embed")) {
		return null;
	}
	return (
		<NextUINavbar maxWidth="xl" position="sticky" isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} height='var(--header-height)'>
			<NavbarContent className="basis-1/5 sm:basis-full" justify="start">
				<NavbarBrand as="li" className="gap-3 max-w-fit">
					<NextLink className="flex justify-start items-center gap-1" href="/">
						<PoppyIconSmall size={18} />
						<p className="font-bold text-inherit">Home</p>
					</NextLink>
				</NavbarBrand>
				<ul className="hidden lg:flex gap-4 justify-start ml-2">
					{navItems.map((item) => (
						<NavbarItem key={item.href}>
							<NextLink
								className={clsx(
									linkStyles({ color: "foreground" }),
									"data-[active=true]:text-primary data-[active=true]:font-medium"
								)}
								color="foreground"
								href={item.href}
							>
								{item.label}
							</NextLink>
						</NavbarItem>
					))}
				</ul>
			</NavbarContent>
			<NavbarContent className="basis-1 pl-4" justify="end">
				<SmallAccountStatus />
				<ThemeSwitch />
				<NavbarMenuToggle />
			</NavbarContent>

			<NavbarMenu>
				<div className="mx-4 mt-2 flex flex-col gap-2">
					{navMenuItems.map((item, index) => (
						<NavbarMenuItem key={`${item}-${index}`}>
							<Link
								color={
									index === 2
										? "primary"
										: index === siteConfig.navMenuItems.length - 1
										? "danger"
										: "foreground"
								}
								href={item.href}
								size="lg"
								onClick={() => {
									setIsMenuOpen()
									if (item.label === "Logout") {
										SignOutListener();
									}
								}}
							>
								{item.label}
							</Link>
						</NavbarMenuItem>
					))}
				</div>
			</NavbarMenu>
		</NextUINavbar>
	);
};
