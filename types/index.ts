import {SVGProps} from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};


export type IconImgProps = {
  size?: number;
};

export type SidebarProps = {
  className?: string;
  style?: React.CSSProperties;
  firstChild: React.ReactNode;
  secondChild: React.ReactNode;
  maxWidth?: string;
  minWidth?: string;
  open?: boolean;
};
