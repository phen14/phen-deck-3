// (K) ALL RIGHTS REVERSED - Reprint what you like

import { DisplayPost } from "../../../../../src/main/ts/api/post/display-post";
import { StatusMedia } from "../../../../../src/main/ts/api/post/status-media";
import { Image } from "../../shared/image";

/**
 * Display an image or set of images.  If there is one image, display the image to fit the width of the list.  If there are multiple,
 * display them in an _(n/2)_ by 2 grid.
 *
 * @param post Post object containing the images.
 * @constructor
 */
export function ImageBlock({ post }: { post: DisplayPost }): JSX.Element {
    if (!post.images) {
        return (<span />);
    }

    const images = post.images.filter((image) => !!image);

    if (!images.length) {
        return (<span />);
    }

    if (images.length == 1) {
        return (
            <div className="imageBlock">
                <Image src={ images[0].url } className="full" />
            </div>
        );
    }

    const pairs: StatusMedia[][] = [];
    const imagesCopy: StatusMedia[] = [...images];

    while (imagesCopy.length > 0) {
        pairs.push(imagesCopy.splice(0, 2));
    }

    const rows: JSX.Element[] = [];
    for (const pair of pairs) {
        let row: JSX.Element;
        if (pair.length == 1) {
            const key = `${ post.id }~${ pair[0].url }`;
            row = (
                <div key={ key }>
                    <div><Image src={ pair[0].url } /></div>
                </div>
            );
        } else {
            const key = `${ post.id }~${ pair[0].url }~${ pair[1].url }`;
            row = (
                <div key={ key }>
                    <div><Image src={ pair[0].url } /></div>
                    <div><Image src={ pair[1].url } /></div>
                </div>
            );
        }
        rows.push(row);
    }
    return (
        <div className="imageBlock">
            { rows }
        </div>
    );
}
