"use client";
import React, { useEffect, useState } from 'react';
import { IconImgProps } from "@/types";
import { useTheme } from "next-themes";

export const PoppyIconSmall = (props: IconImgProps) => {
    const { theme } = useTheme();
    const [logo, setLogo] = useState("/logoSmallLight.png");

    useEffect(() => {
        setLogo(theme === "dark" ? "/logoSmallLight.png" : "/logoSmallDark.png");
    }, [theme]);

    return (
        <img
            alt="Small logo"
            src={logo}
            width={props.size}
            height={props.size}
            {...props}
        />
    );
}

export const PoppyIconLarge = (props: IconImgProps) => {
    const { theme } = useTheme();
    const [logo, setLogo] = useState("/logoLight.png");

    useEffect(() => {
        setLogo(theme === "dark" ? "/logoLight.png" : "/logoDark.png");
    }, [theme]);

    return (
        <img
            alt="Large logo"
            src={logo}
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