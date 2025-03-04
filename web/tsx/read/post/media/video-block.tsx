import { DisplayPost } from "../../../../../src/main/ts/api/post/display-post";
import { VideoPlaylistBlock } from "./video-playlist-block";

export function VideoBlock({ post } : { post: DisplayPost }): JSX.Element {
    if (!post.videos || !post.videos.length) {
        return (<span/>);
    }

    if (post.videos[0].url.endsWith(".m3u8")) {
        return (
            <VideoPlaylistBlock post={post} />
        )
    }

    return (
        <div className="video">
            <video controls={true} src={post.videos[0].url} style={{ width: '100%'}} />
        </div>
    );
}
