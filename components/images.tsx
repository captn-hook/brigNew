"use client";
import { IconImgProps } from "@/types";
import { useTheme } from "next-themes";

//import Image from "next/image";


export const PoppyIconSmall = (props: IconImgProps) => {
	const { theme, setTheme } = useTheme();
  

	const lightLogo = "/logoSmallLight.png";
	const darkLogo = "/logoSmallDark.png";

	return (
		<img
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
		<img
			alt="Large logo"
			src={theme === "light" ? darkLogo : lightLogo}
			width={props.size}
			height={props.size}
			{...props}
		/>
	);
}

export const GoogleIcon = (props: IconImgProps) => {
	const googleSvg = "/google.svg";

	return (
		<img
			alt="Google logo"
			src={googleSvg}
			width={props.size}
			height={props.size}
			{...props}
		/>
	);
}