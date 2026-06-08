// (K) ALL RIGHTS REVERSED - Reprint what you like

import Hls from "hls.js";
import { JSX, useEffect, useRef } from "react";
import { DisplayPost } from "../../../../../src/main/ts/api/post/display-post";

/**
 * Display a video from Bluesky, which has to make everything extra complicated.
 *
 * @param post Post containing the link to the video.
 * @constructor
 */
export function VideoPlaylistBlock({ post } : { post: DisplayPost }): JSX.Element {
    if (!post.videos || !post.videos.length) {
        return (<span/>);
    }

    const videoRef = useRef<null | HTMLVideoElement>(null);

    useEffect(()=>{
        const hls = new Hls({
            debug: false
        });

        if (Hls.isSupported()) {
            hls.loadSource(post.videos[0].url);
            hls.attachMedia(videoRef.current as HTMLMediaElement);
            hls.on(Hls.Events.ERROR, (err) => {
                console.log(err)
            });

        }
    },[post])

    return (
        <div className="video">
            <video controls={true} ref={videoRef} src={post.videos[0].url} style={{ width: '100%'}} />
        </div>
    );
}
