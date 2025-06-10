// (K) ALL RIGHTS REVERSED - Reprint what you like

import React, { JSX, useRef } from "react";

import "./post.css";
import "./poster.css";
import { DisplayPost } from "../../../../src/main/ts/api/post/display-post";
import { ActionRow } from "./action-row";
import { GifBlock } from "./media/gif-block";
import { ImageBlock } from "./media/image-block";
import { LinkCard } from "./media/link-card";
import { VideoBlock } from "./media/video-block";
import { BigHeader } from "./poster/big-header";
import { RetweetHeader } from "./poster/retweet-header";
import { SmallHeader } from "./poster/small-header";
import { RepliedToPost } from "./replied-to-post";
import { RepliedToRepliedToPost } from "./replied-to-replied-to-post";

type Props = {
    isEmbedded?: boolean,
    isRepliedTo?: boolean,
    post: DisplayPost
}

/**
 * Display a post.
 *
 * @param isEmbedded Is this post embedded in another post?
 * @param isRepliedTo Is this post a post that the main post replied to?
 * @param post The post to display.
 * @constructor
 */
export function PostElement({ isEmbedded, isRepliedTo, post } : Props): JSX.Element {
    if (!post) {
        return <span />;
    }

    const rawRef = useRef(null);
    const rawHandler = () => {
        if (!rawRef.current) {
            return;
        }

        const current = rawRef.current as HTMLDivElement;
        if (current.style.display == "none") {
            current.style.display = "block";
        } else {
            current.style.display = "none";
        }
    }

    // ClassName
    let className = "post";
    if (isEmbedded) {
        className = "embedded";
    } else if (isRepliedTo) {
        className = "repliedTo";
    }

    if (post.isMe || post.isRetweetedByMe) {
        className += " me";
    } else {
        className += " notme";
    }

    let contentClassName = "";
    if (!post.isMe) {
        contentClassName = "notMe";
    }

    // Header
    let headerSection: JSX.Element;
    if (post.isRetweet) {
        headerSection = <RetweetHeader post={post} />;
    } else if (isRepliedTo) {
        headerSection = <SmallHeader post={post}/>;
    } else {
        headerSection = <BigHeader post={post}/>;
    }

    // Quoted
    let quoteSection: JSX.Element | string = "";
    if(!isRepliedTo && !post.isRetweet && post.isQuoteTweet) {
        quoteSection = (
            <div className="quoteSection">
                <PostElement post={ post.quoteTweet! } isEmbedded={ true } />
            </div>
        )
    } else if (post.isRabbitHole) {
        quoteSection = (
            <div className="rabbitHole">
                <a href={ post.rabbitHoleUrl! } target="_blank">The rabbit hole goes deeper...</a>
            </div>
        )
    }

    // Replied-to
    let repliedToSection: string | JSX.Element = "";
    if (post.isReply) {
        if (isRepliedTo || post.isRetweet) {
            repliedToSection = <RepliedToRepliedToPost post={post} />;
        } else {
            repliedToSection = <RepliedToPost post={post} />;
        }
    }

    const gifSection = (post.animatedImages.length > 0) ? <GifBlock post={post} /> : "";
    const imageSection = (post.images.length > 0) ? <ImageBlock post={post} /> : "";
    const linkSection = (!post.isRetweet && post.linkCard) ? <LinkCard post={post} /> : "";
    const videoSection = (post.videos.length > 0) ? <VideoBlock post={post} /> : "";
    const retweetSection = (post.isRetweet) ? <PostElement post={post.retweet!} isEmbedded={ true } /> : "";
    const actionRowSection = (isEmbedded || isRepliedTo) ? "" : <ActionRow post={post} rawHandler={rawHandler} />;

    const postCopy = structuredClone(post);
    postCopy.raw = "";

    return (
        <div className={ className }>
            { repliedToSection }
            { headerSection }
            <div className={contentClassName}>
                <div dangerouslySetInnerHTML={{ __html: post.postText }}/>
                { imageSection }
                { gifSection }
                { videoSection }
                { linkSection }
                { retweetSection }
                { quoteSection }
                <div className="raw" ref={rawRef} style={{display: "none"}}>
                    <div>
                        <pre>
                            <code>
                                { JSON.stringify(JSON.parse(post.raw), undefined, 2) }
                            </code>
                        </pre>
                    </div>
                    <hr />
                    <div>
                        <pre>
                            <code>
                                { JSON.stringify(postCopy, undefined, 2) }
                            </code>
                        </pre>
                    </div>
                </div>
            </div>
            { actionRowSection }
        </div>
    );
}
