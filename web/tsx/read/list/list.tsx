// (K) ALL RIGHTS REVERSED - Reprint what you like

import { JSX, useState } from "react";

import "./list.css";
import { DisplayItem } from "../../../../src/main/ts/api/display-item";
import { DisplayItemType } from "../../../../src/main/ts/api/display-item-type";
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
export function List({ config, onChange, name }: { config: PhenDeckConfig, onChange?: Function, name: string }): JSX.Element {
    const [data, setData] = useState<DisplayItem[]>([]);

    getElectron().ipcRenderer.only("getPosts" as Channels, (arg, hardReset) => {
        console.log("Got posts...", new Date());
        const posts = arg as DisplayItem[];
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

        const combinedPosts = [...data, message];
        updateTimestamps(combinedPosts);
        setData(combinedPosts);
    });

    const getPosts = () => {
        getElectron().ipcRenderer.sendMessage("getPosts" as Channels);
    };

    const clearData = () => {
        setData([]);
        if (onChange) {
            onChange([]);
        }
    };

    const getFilteredPosts = (posts: DisplayItem[]) => {
        const filters = [systemMessageFilter];
        if (config.timeline.hideNonMutualReplies) {
            filters.push(hideNonMutualRepliesFilter)
        };

        if (!filters.length) {
            return posts;
        }

        return posts.filter((item) => doFilter(item, filters));
    };

    const doFilter = (item: DisplayItem, filters: Function[]) => {
        for (let i = 0; i < filters.length; i++) {
            if (!filters[i](item)) {
                return false;
            }
        }
        return true;
    }

    const hideNonMutualRepliesFilter = (item: DisplayItem) => {
        if (item.type !== DisplayItemType.POST.valueOf()) {
            return true;
        }

        const post = item as DisplayPost;
        return (post).isMe || !(post).isReply || (post).isRepliedToMutual;
    }

    const systemMessageFilter = (item: DisplayItem) => {
        if (item.type !== DisplayItemType.SYSTEM_MESSAGE.valueOf()) {
            return true;
        }

        const msg = item as SystemMessage;
        return msg.level >= config.timeline.systemMessageLevel.valueOf();
    }

    let shown = getFilteredPosts(data);
    if (!config.timeline.ascendingOrder) {
        shown = shown.reverse();
    }
    const postsShownCount = shown.filter((item: DisplayItem) => item.type === DisplayItemType.POST.valueOf()).length;

    return (
        <div className="list">
            <ListHeader clear={ clearData } count={ postsShownCount } name={ name } />
            <ListBody items={ shown } />
        </div>
    );
}


/**
 * Update the relative time field of all the posts in the list.
 *
 * @param posts
 */
function updateTimestamps(posts: DisplayItem[]) {
    for (let post of posts) {
        if (post.type === DisplayItemType.POST.valueOf()) {
            updateTimestampsForPost(post as DisplayPost);
        }
    }
}

/**
 * Update the relative time field of a post and all its associated posts.
 *
 * @param item
 */
function updateTimestampsForPost(item: DisplayItem): void {
    if (item.type !== DisplayItemType.POST.valueOf()) {
        return;
    }
    const post = item as DisplayPost;
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
