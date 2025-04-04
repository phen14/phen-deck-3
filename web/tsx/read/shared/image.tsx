// (K) ALL RIGHTS REVERSED - Reprint what you like

import "./image.css";

import { JSX, useState } from "react";
import { ImageOverlay } from "./image-overlay";

/**
 * Display an image and set up the on-click overlay.
 *
 * @param src Image URL.
 * @param alt Alt text.
 * @param className CSS class to put on the &gt;img> tag.
 * @constructor
 */
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
