import { UserAccountProfile } from "../account/user-account-profile";
import { StatusLink } from "./status-link";
import { StatusMedia } from "./status-media";

export interface StatusPost {
    getId(): string;
    getRaw(): string;

    // Viewer
    getViewer(): UserAccountProfile;
    hasViewerRetweeted(): boolean;

    // Poster
    getPosterAvatarUrl(): string | null | undefined;
    getPosterDisplayName(): string;
    getPosterHandle(): string;
    getPosterService(): string;
    isMe(): boolean;
    isRetweetedByMe(): boolean;

    // Time
    getTimestamp(): Date;

    // Content
    getPostText(): string;
    getLinkCard(): StatusLink | null;

    // Media
    getImages(): StatusMedia[];
    getAnimatedImages(): StatusMedia[];
    getVideos(): StatusMedia[];

    // Reply
    isReply(): boolean;
    getRepliedTo(): StatusPost | null;
    getRepliedToPosterDisplayName(): Promise<string | null | undefined>;
    isRepliedToMutual(): boolean;

    // Retweets
    isQuoteTweet(): boolean;
    getQuoteTweet(): StatusPost | null;
    isRabbitHole(): boolean;
    isRetweet(): boolean;
    getRetweet(): StatusPost | null;
}
