// (K) ALL RIGHTS REVERSED - Reprint what you like

import { JSX, useState } from "react";

import "./list.css";
import { DisplayPost } from "../../../../src/main/ts/api/post/display-post";
import { SystemMessage } from "../../../../src/main/ts/api/system/system-message";
import { Channels } from "../../../../src/main/ts/app/preload";
import { PhenDeckConfig } from "../../../../src/main/ts/config/phen-deck-config";
import { getElectron } from "../../util/get-electron";
import { timeSince } from "../../util/time-utils";
import { ListBody } from "./list-body";
import { ListHeader } from "./list-header";

/**
 * Display a list of posts with a header.
 *
 * @param config Global config.
 * @param name Name of the list.
 * @constructor
 */
export function List({ config, onChange, name } : { config: PhenDeckConfig, onChange?: Function, name: string }): JSX.Element {
    const [data, setData] = useState<DisplayPost[]>([]);

    getElectron().ipcRenderer.only("getPosts" as Channels, (arg, hardReset) => {
        console.log("Got posts...", new Date());
        const posts = arg as DisplayPost[];
        const combinedPosts = hardReset ? posts : [...data, ...posts];

        updateTimestamps(combinedPosts);
        setData(combinedPosts);

        if (onChange) {
            const shown = getFilteredPosts(combinedPosts);
            onChange(shown);
        }
    });

    getElectron().ipcRenderer.only("systemMessage" as Channels, (arg) => {
        const message = arg as SystemMessage;
        console.log(message);
    });

    const getPosts = () => {
        getElectron().ipcRenderer.sendMessage("getPosts" as Channels);
    };

    const clearData = () => {
        setData([]);
        if (onChange) {
            onChange([]);
        }
    }

    const getFilteredPosts = (posts: DisplayPost[]) => {
        return config.timeline.hideNonMutualReplies ?
            posts.filter((post) => post.isMe || !post.isReply || post.isRepliedToMutual) :
            posts;
    }

    let shown = getFilteredPosts(data);
    if (!config.timeline.ascendingOrder) {
        shown = shown.reverse();
    }

    return (
        <div className="list">
            <ListHeader clear={clearData} count={shown.length} name={name} />
            <ListBody posts={shown} />
        </div>
    );
}


/**
 * Update the relative time field of all the posts in the list.
 *
 * @param posts
 */
function updateTimestamps(posts: DisplayPost[]) {
    for (let post of posts) {
        updateTimestampsForPost(post);
    }
}

/**
 * Update the relative time field of a post and all its associated posts.
 *
 * @param post
 */
function updateTimestampsForPost(post: DisplayPost): void {
    post.timeSince = timeSince(post.timestamp);
    if (post.repliedTo) {
        post.repliedTo.timeSince = timeSince(post.repliedTo.timestamp);
    }
    if (post.retweet) {
        post.retweet.timeSince = timeSince(post.retweet.timestamp);
        updateTimestampsForPost(post.retweet);
    }
    if (post.quoteTweet) {
        post.quoteTweet.timeSince = timeSince(post.quoteTweet.timestamp);
        updateTimestampsForPost(post.quoteTweet);
    }
}
