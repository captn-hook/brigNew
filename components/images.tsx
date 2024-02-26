"use client";
import { IconImgProps } from "@/types";
import { useTheme } from "next-themes";
import Image from "next/image";


export const PoppyIconSmall = (props: IconImgProps) => {
	const { theme, setTheme } = useTheme();
  

	const lightLogo = "/logoSmallLight.png";
	const darkLogo = "/logoSmallDark.png";

	return (
		<Image
			alt="Small logo"
			src={theme === "light" ? darkLogo : lightLogo}
			width={props.size}
			height={props.size}
			{...props}
		/>
	);
}
export const PoppyIconLarge = (props: IconImgProps) => {
	const { theme, setTheme } = useTheme();
  

	const lightLogo = "/logoLight.png";
	const darkLogo = "/logoDark.png";

	return (
		<Image
			alt="Large logo"
			src={theme === "light" ? darkLogo : lightLogo}
			width={props.size}
			height={props.size}
			{...props}
		/>
	);
}