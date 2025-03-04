import { DisplayPost } from "../../../../../src/main/ts/api/post/display-post";
import { Image } from "../../shared/image";

export function GifBlock({ post }: { post: DisplayPost }): JSX.Element {
    if (!post.animatedImages || !post.animatedImages.length) {
        return (<span />);
    }

    const oneAndOnlyGif = post.animatedImages[0].url;

    const imageSection = (oneAndOnlyGif.endsWith(".mp4")) ?
        <video autoPlay={ true } controls={ false } loop={ true } playsInline={ true } src={ oneAndOnlyGif } style={ { width: "100%" } } /> :
        <Image src={ oneAndOnlyGif } className="full" />;

    return (
        <div className="video">
            { imageSection }
        </div>
    );
}
