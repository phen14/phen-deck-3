// (K) ALL RIGHTS REVERSED - Reprint what you like

import { JSX } from "react";
import { DisplayPost } from "../../../../../src/main/ts/api/post/display-post";
import { VideoPlaylistBlock } from "./video-playlist-block";

/**
 * Display a video.
 *
 * @param post Post containing the link to the video.
 * @constructor
 */
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
