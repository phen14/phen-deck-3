import Hls from "hls.js";
import { useEffect, useRef } from "react";
import { DisplayPost } from "../../../../../src/main/ts/api/post/display-post";

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
