import { UserAccountProfile } from "../account/user-account-profile";
import { StatusLink } from "./status-link";
import { StatusMedia } from "./status-media";
import { StatusPost } from "./status-post";

export type DisplayPost = {
    id: string;
    raw: string;

    // Viewer
    isMe: boolean;
    isRetweetedByMe: boolean;
    viewer: UserAccountProfile;
    hasViewerRetweeted: boolean;

    // Poster
    posterAvatarUrl: string | null | undefined;
    posterDisplayName: string;
    posterHandle: string;
    posterService: string;

    // Time
    timestamp: Date;
    timeSince: string;

    // Content
    postText: string;
    linkCard: StatusLink | null;

    // Media
    images: StatusMedia[];
    animatedImages: StatusMedia[];
    videos: StatusMedia[];

    // Reply
    isReply: boolean;
    repliedTo: DisplayPost | null;
    repliedToPosterDisplayName: string | null | undefined;
    isRepliedToMutual: boolean;

    // Retweets
    isQuoteTweet: boolean;
    quoteTweet: DisplayPost | null;
    isRabbitHole: boolean;
    isRetweet: boolean;
    retweet: DisplayPost | null;

};

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
        repliedToPosterDisplayName: await statusPost.getRepliedToPosterDisplayName(),
        isRepliedToMutual: statusPost.isRepliedToMutual(),

        // Retweets
        isQuoteTweet: statusPost.isQuoteTweet(),
        quoteTweet: await convertStatusPostToDisplayPost(statusPost.getQuoteTweet()),
        isRabbitHole: statusPost.isRabbitHole(),
        isRetweet: statusPost.isRetweet(),
        retweet: await convertStatusPostToDisplayPost(statusPost.getRetweet())
    };
}

function convertPostText(text: string): string {
    let convertedText = text.replaceAll("\n", "<br />");
    convertedText = convertedText.replaceAll("<a ", "<a target='_blank' rel='noopener noreferrer' ");

    return convertedText;
}
