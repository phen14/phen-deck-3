// (K) ALL RIGHTS REVERSED - Reprint what you like

import { UserAccountProfile } from "../account/user-account-profile";
import { StatusLink } from "./status-link";
import { StatusMedia } from "./status-media";

/**
 * Interface for classes that extract post information from a service model of a post.
 */
export interface StatusPost {
    getId(): string;
    getCid(): string;
    getRawString(): string;
    getUrl(): string;

    // Viewer
    getViewer(): UserAccountProfile;
    getViewerAccountId(): string;
    hasViewerRetweeted(): boolean;

    // Poster
    getPosterAvatarUrl(): string | undefined;
    getPosterDisplayName(): string;
    getPosterHandle(): string;
    getPosterService(): string;
    getPosterUrl(): string;
    isMe(): boolean;
    isRetweetedByMe(): boolean;

    // Time
    getTimestamp(): Date;

    // Content
    getPostText(): string;
    getLinkCard(): StatusLink | undefined;

    // Media
    getImages(): StatusMedia[];
    getAnimatedImages(): StatusMedia[];
    getVideos(): StatusMedia[];

    // Reply
    isReply(): boolean;
    getRepliedTo(): StatusPost | undefined;
    getRepliedToUrl(): string | undefined;
    getRepliedToPosterDisplayName(): Promise<string | undefined>;
    isRepliedToMutual(): boolean;

    // Retweets
    isQuoteTweet(): boolean;
    getQuoteTweet(): StatusPost | undefined;
    isRabbitHole(): boolean;
    getRabbitHoleUrl(): string | undefined;
    isRetweet(): boolean;
    getRetweet(): StatusPost | undefined;
}
