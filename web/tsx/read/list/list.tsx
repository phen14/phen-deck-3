// (K) ALL RIGHTS REVERSED - Reprint what you like

import { JSX, useState } from "react";

import "./list.css";
import { DisplayPost } from "../../../../src/main/ts/api/post/display-post";
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

    getElectron().ipcRenderer.on("getPosts" as Channels, (arg, hardReset) => {
        const posts = arg as DisplayPost[];
        const combinedPosts = hardReset ? posts : [...data, ...posts];

        updateTimestamps(combinedPosts);
        setData(combinedPosts);

        if (onChange) {
            onChange(combinedPosts);
        }
    });

    const getPosts = () => {
        getElectron().ipcRenderer.sendMessage("getPosts" as Channels);
    };

    function clearData() {
        setData([]);
        if (onChange) {
            onChange([]);
        }
    }

    const shown = config.timeline.hideNonMutualReplies ?
        data.filter((post) => post.isMe || !post.isReply || post.isRepliedToMutual) :
        data;

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
