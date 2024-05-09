import { useState } from "react";
import { Button } from "@nextui-org/button";

//onclick, text1, text2, ... className, style, children 
interface SwitchButtonProps {
  text1: string;
  text2: string;
  onPress: any;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  id?: string;
  title?: string;
}

export const SwitchButton = (props: SwitchButtonProps) => {
    
    //wrap the onClick function to toggle the text, using state
    const [text, setText] = useState(props.text1);
    const onPress = () => {
        props.onPress().then(() => {
            setText(text === props.text1 ? props.text2 : props.text1);
        });
    }

    return (
        <Button  className={props.className} style={props.style} id={props.id} title={props.title} onPress={onPress}>
            {text}
            {props.children}
        </Button>
    );
}

//three state button
//onclick, text1, text2, text3, ... className, style, children
interface ThreeStateButtonProps {
    text1: string;
    text2: string;
    text3: string;
    onPress: any;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    id?: string;
    title?: string;
}

export const ThreeStateButton = (props: ThreeStateButtonProps) => {
    
    //wrap the onClick function to toggle the text, using state
    const [text, setText] = useState(props.text1);
    const onPress = () => {
        props.onPress().then(() => {
            setText(text === props.text1 ? (text === props.text2 ? props.text3 : props.text2) : props.text1);
        });
    }

    return (
        <Button className={props.className} style={props.style}  id={props.id} title={props.title} onPress={onPress}>
            {text}
            {props.children}
        </Button>
    );
}