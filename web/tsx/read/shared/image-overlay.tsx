import { JSX, MouseEventHandler } from "react";

export function ImageOverlay({ src, alt, close } : { src: string, alt?: string, close: MouseEventHandler }): JSX.Element {

    return (
        <div className="imageOverlay" onClick={close}>
            <img className="full" src={src} alt={alt} />
        </div>
    );
}
