import "./image.css";

import { JSX, useState } from "react";
import { ImageOverlay } from "./image-overlay";


export function Image({ src, alt, className } : { src: string, alt?: string, className?: string }): JSX.Element {
    const [overlay, setOverlay] = useState<JSX.Element | string>("");

    const close = () => {
        setOverlay("");
    }
    const open = () => {
        setOverlay((
            <ImageOverlay src={src} alt={alt} close={close}/>
        ));
    }

    return (
        <div>
            <img className={className} src={src} alt={alt} onClick={open}/>
            <div>
                {overlay}
            </div>
        </div>
    );
}
