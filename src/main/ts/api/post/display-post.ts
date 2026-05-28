// (K) ALL RIGHTS REVERSED - Reprint what you like

import { UserAccountProfile } from "../account/user-account-profile";
import { StatusLink } from "./status-link";
import { StatusMedia } from "./status-media";
import { StatusPost } from "./status-post";


/**
 * All the information needed to display a post in the UI.
 */
export class DisplayPost {
    id: string;
    cid: string;
    raw: string;
    url: string;

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

    posterAvatarUrl?: string;
    posterDisplayName: string;
    posterHandle: string;
    posterService: string;
    posterUrl: string;

    // ---------------------------------
    // ~~~~~| Time |~~~~~

    timestamp: Date;
    timeSince: string;

    // ---------------------------------
    // ~~~~~| Content |~~~~~

    postText: string;
    linkCard?: StatusLink;

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
    repliedTo?: DisplayPost;

    // URL of the post that this post replied to.
    repliedToUrl?: string;

    // Who made the post that this post replied to.
    repliedToPosterDisplayName?: string;

    // Is the post this is a reply to also somebody I'm following?
    isRepliedToMutual: boolean;

    // ---------------------------------
    // ~~~~~| Retweet |~~~~~

    // Is this post quoting another post?
    isQuoteTweet: boolean;

    // The post this post is quoting.
    quoteTweet?: DisplayPost;

    // Is the post being quoted while also quoting another post?
    isRabbitHole: boolean;

    // Link to the rabbit hole post.
    rabbitHoleUrl?: string;

    // Is this post a retweet?
    isRetweet: boolean;

    // The post being retweeted.
    retweet?: DisplayPost;

    private constructor(statusPost: StatusPost, repliedTo?: DisplayPost, quoteTweet?: DisplayPost, retweet?: DisplayPost, repliedToName?: string) {
        this.id = statusPost.getId();
        this.cid = statusPost.getCid();
        this.raw = statusPost.getRawString();
        this.url = statusPost.getUrl();

        // Viewer
        this.viewer = statusPost.getViewer();
        this.hasViewerRetweeted = statusPost.hasViewerRetweeted();

        // Poster
        this.isMe = statusPost.isMe();
        this.isRetweetedByMe = statusPost.isRetweetedByMe();
        this.posterAvatarUrl = statusPost.getPosterAvatarUrl();
        this.posterDisplayName = statusPost.getPosterDisplayName();
        this.posterHandle = statusPost.getPosterHandle();
        this.posterService = statusPost.getPosterService();
        this.posterUrl = statusPost.getPosterUrl();

        // Time
        this.timestamp = statusPost.getTimestamp();
        this.timeSince = "";

        // Content
        this.postText = convertPostText(statusPost.getPostText());
        this.linkCard = statusPost.getLinkCard();

        // Media
        this.images = statusPost.getImages();
        this.animatedImages = statusPost.getAnimatedImages();
        this.videos = statusPost.getVideos();

        // Reply
        this.isReply = statusPost.isReply();
        this.repliedTo = repliedTo;
        this.repliedToUrl = statusPost.getRepliedToUrl();
        this.repliedToPosterDisplayName = repliedToName;
        this.isRepliedToMutual = statusPost.isRepliedToMutual();

        // Retweets
        this.isQuoteTweet = statusPost.isQuoteTweet();
        this.quoteTweet = quoteTweet;
        this.isRabbitHole = statusPost.isRabbitHole();
        this.rabbitHoleUrl = statusPost.getRabbitHoleUrl();
        this.isRetweet = statusPost.isRetweet();
        this.retweet = retweet;
    }

    static convertStatusPostToDisplayPost = async (statusPost? : StatusPost): Promise<DisplayPost | undefined> => {
        if (!statusPost) {
            return undefined;
        }

        const promises: Promise<DisplayPost | undefined>[] = [
            DisplayPost.convertStatusPostToDisplayPost(statusPost.getRepliedTo()),
            DisplayPost.convertStatusPostToDisplayPost(statusPost.getQuoteTweet()),
            DisplayPost.convertStatusPostToDisplayPost(statusPost.getRetweet()),
        ];
        const [repliedTo, quoteTweet, retweet] = await Promise.all(promises);
        const repliedToName = await statusPost.getRepliedToPosterDisplayName();

        return new DisplayPost(statusPost, repliedTo, quoteTweet, retweet, repliedToName);
    }
};

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
