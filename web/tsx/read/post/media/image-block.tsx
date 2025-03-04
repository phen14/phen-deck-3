import { DisplayPost } from "../../../../../src/main/ts/api/post/display-post";
import { StatusMedia } from "../../../../../src/main/ts/api/post/status-media";
import { Image } from "../../shared/image";

export function ImageBlock({ post } : { post: DisplayPost }): JSX.Element {
    if (!post.images) {
        return (<span/>);
    }

    const images = post.images.filter((image) => !!image);

    if (!images.length) {
        return (<span/>);
    }

    if (images.length == 1) {
        return (<Image src={images[0].url} className="full" />);
    }

    const pairs: StatusMedia[][] = [];
    const imagesCopy: StatusMedia[] = [...images];

    while (imagesCopy.length > 0) {
        pairs.push(imagesCopy.splice(0, 2));
    }

    const rows:JSX.Element[] = [];
    for (const pair of pairs) {
        let row: JSX.Element;
        if (pair.length == 1) {
            row = (
                <div>
                    <div><Image src={pair[0].url}/></div>
                </div>
            )
        } else {
            row = (
                <div>
                    <div><Image src={pair[0].url}/></div>
                    <div><Image src={pair[1].url}/></div>
                </div>
            )
        }
        rows.push(row);
    }
    return (
        <div>
            { rows }
        </div>
    );
}
