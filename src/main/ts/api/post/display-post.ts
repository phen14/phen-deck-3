// (K) ALL RIGHTS REVERSED - Reprint what you like

import { UserAccountProfile } from "../account/user-account-profile";
import { StatusLink } from "./status-link";
import { StatusMedia } from "./status-media";
import { StatusPost } from "./status-post";


/**
 * All the information needed to display a post in the UI.
 */
export type DisplayPost = {
    id: string;
    raw: string;

    // ---------------------------------
    // ~~~~~| Viewer |~~~~~

    // Is this my post?
    isMe: boolean;

    // Is this my retweet of a post?
    isRetweetedByMe: boolean;

    // My profile
    viewer: UserAccountProfile;

    // Have I ever retweeted this?
    hasViewerRetweeted: boolean;

    // ---------------------------------
    // ~~~~~| Poster |~~~~~

    posterAvatarUrl: string | null | undefined;
    posterDisplayName: string;
    posterHandle: string;
    posterService: string;

    // ---------------------------------
    // ~~~~~| Time |~~~~~

    timestamp: Date;
    timeSince: string;

    // ---------------------------------
    // ~~~~~| Content |~~~~~

    postText: string;
    linkCard: StatusLink | null;

    // ---------------------------------
    // ~~~~~| Media |~~~~~

    images: StatusMedia[];
    animatedImages: StatusMedia[];
    videos: StatusMedia[];

    // ---------------------------------
    // ~~~~~| Reply |~~~~~

    // Is this post a reply to another post?
    isReply: boolean;

    // The post that this post replied to.
    repliedTo: DisplayPost | null;

    // URL of the post that this post replied to.
    repliedToUrl: string | null;

    // Who made the post that this post replied to.
    repliedToPosterDisplayName: string | null | undefined;

    // Is the post this is a reply to also somebody I'm following?
    isRepliedToMutual: boolean;

    // ---------------------------------
    // ~~~~~| Retweet |~~~~~

    // Is this post quoting another post?
    isQuoteTweet: boolean;

    // The post this post is quoting.
    quoteTweet: DisplayPost | null;

    // Is the post being quoted while also quoting another post?
    isRabbitHole: boolean;

    // Link to the rabbit hole post.
    rabbitHoleUrl: string | null | undefined;

    // Is this post a retweet?
    isRetweet: boolean;

    // The post being retweeted.
    retweet: DisplayPost | null;

};


/**
 * Extract all the information we need to display a post from a service post model.
 *
 * @param statusPost
 */
export const convertStatusPostToDisplayPost = async (statusPost : StatusPost | null): Promise<DisplayPost | null> => {
    if (!statusPost) {
        return null;
    }

    return {
        id: statusPost.getId(),
        raw: statusPost.getRaw(),

        // Viewer
        viewer: statusPost.getViewer(),
        hasViewerRetweeted: statusPost.hasViewerRetweeted(),

        // Poster
        isMe: statusPost.isMe(),
        isRetweetedByMe: statusPost.isRetweetedByMe(),
        posterAvatarUrl: statusPost.getPosterAvatarUrl(),
        posterDisplayName: statusPost.getPosterDisplayName(),
        posterHandle: statusPost.getPosterHandle(),
        posterService: statusPost.getPosterService(),

        // Time
        timestamp: statusPost.getTimestamp(),
        timeSince: "",

        // Content
        postText: convertPostText(statusPost.getPostText()),
        linkCard: statusPost.getLinkCard(),

        // Media
        images: statusPost.getImages(),
        animatedImages: statusPost.getAnimatedImages(),
        videos: statusPost.getVideos(),

        // Reply
        isReply: statusPost.isReply(),
        repliedTo: await convertStatusPostToDisplayPost(statusPost.getRepliedTo()),
        repliedToUrl: statusPost.getRepliedToUrl(),
        repliedToPosterDisplayName: await statusPost.getRepliedToPosterDisplayName(),
        isRepliedToMutual: statusPost.isRepliedToMutual(),

        // Retweets
        isQuoteTweet: statusPost.isQuoteTweet(),
        quoteTweet: await convertStatusPostToDisplayPost(statusPost.getQuoteTweet()),
        isRabbitHole: statusPost.isRabbitHole(),
        rabbitHoleUrl: statusPost.getRabbitHoleUrl(),
        isRetweet: statusPost.isRetweet(),
        retweet: await convertStatusPostToDisplayPost(statusPost.getRetweet())
    };
}

/**
 * Make adjustments to the basic text of a post to make it display nicely.
 *
 * @param text
 */
function convertPostText(text: string): string {
    let convertedText = text.replaceAll("\n", "<br />");
    convertedText = convertedText.replaceAll("<a ", "<a target='_blank' rel='noopener noreferrer' ");

    return convertedText;
}
