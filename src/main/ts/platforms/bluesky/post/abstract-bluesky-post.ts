// (K) ALL RIGHTS REVERSED - Reprint what you like

import * as AppBskyEmbedRecord from "@atproto/api/src/client/types/app/bsky/embed/record";
import * as AppBskyEmbedRecordWithMedia from "@atproto/api/src/client/types/app/bsky/embed/recordWithMedia";
import { encode } from "html-entities";
import { UserAccountProfile } from "../../../api/account/user-account-profile";
import { StatusPost } from "../../../api/post/status-post";
import { StatusMedia } from "../../../api/post/status-media";
import { StatusLink } from "../../../api/post/status-link";
import { PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { isMain as isExternalMain, isView as isExternalView } from "@atproto/api/dist/client/types/app/bsky/embed/external";
import * as AppBskyEmbedExternal from "@atproto/api/src/client/types/app/bsky/embed/external";
import { AppBskyEmbedImages, AppBskyEmbedVideo, Facet, RichText } from "@atproto/api";
import { isView as isImageView } from "@atproto/api/dist/client/types/app/bsky/embed/images";
import { isView as isVideoView } from "@atproto/api/dist/client/types/app/bsky/embed/video";
import { ViewRecord } from "@atproto/api/dist/client/types/app/bsky/embed/record";
import { isView as isRecordWithMediaView } from "@atproto/api/dist/client/types/app/bsky/embed/recordWithMedia";

export abstract class AbstractBlueskyPost implements StatusPost {
    private readonly AT_URI_REGEX = "at://(.*)/app.bsky.feed.post/(.*)";
    private readonly URL_FORMAT = "https://bsky.app/profile/AT_ID/post/RKEY";

    protected readonly viewer: UserAccountProfile;
    protected readonly viewerAccountId: string;

    protected constructor(viewingAccount: UserAccountProfile, viewerAccountId: string) {
        this.viewer = viewingAccount;
        this.viewerAccountId = viewerAccountId;
    }

    protected abstract getBase(): PostView | ViewRecord;
    protected abstract getRecord() : BlueRecord;

    getId(): string {
        return this.getBase().uri ?? "";
    }

    getCid(): string {
        return this.getBase().cid ?? "";
    }

    getRaw(): string {
        try {
            return JSON.stringify(this.getBase());
        } catch (ignored) {
            return "";
        }
    }

    getUrl(): string {
        return this.convertAtToUrl(this.getBase().uri);
    }

    // ---------------------------------------
    // ~~~~~| Viewer |~~~~~

    getViewer(): UserAccountProfile {
        return this.viewer;
    }

    hasViewerRetweeted(): boolean {
        return false;
    }

    // ---------------------------------------
    // ~~~~~| Poster |~~~~~

    getPosterAvatarUrl(): string | null | undefined {
        return this.getBase().author?.avatar;
    }

    getPosterDisplayName(): string {
        return !this.getBase().author?.displayName ? this.getPosterHandle() : this.getBase().author?.displayName!;
    }

    getPosterHandle(): string {
        return this.getBase().author?.handle;
    }

    getPosterService(): string {
        return "Bluesky";
    }

    isMe(): boolean {
        if (this.isRetweet()) {
            return this.getViewer().rawHandle === this.getRetweet()!.getPosterHandle();
        } else {
            return this.getViewer().rawHandle === this.getPosterHandle();
        }
    }

    isRetweetedByMe(): boolean {
        return this.isRetweet() && this.getViewer().rawHandle === this.getPosterHandle();
    }


    // ---------------------------------------
    // ~~~~~| Time |~~~~~

    getTimestamp(): Date {
        return new Date(this.getRecord()?.createdAt ?? new Date(Date.UTC(1900,1,1)));
    }

    // ---------------------------------------
    // ~~~~~| Content |~~~~~

    getPostText(): string {
        const text = this.getRecord()?.text ?? "";
        const facets = this.getRecord().facets;
        const rt = new RichText({text, facets});

        // Mostly from the docs
        let markdown = "";
        for (const segment of rt.segments()) {
            if (segment.isLink()) {
                markdown += `<a href="${ segment.link?.uri }">${ segment.text }</a>`;
            } else if (segment.isMention()) {
                markdown += `<a href="https://bsky.app/profile/${ segment.mention?.did }">${ segment.text }</a>`;
            } else if (segment.isTag()) {
                markdown += `<a href="https://bsky.app/hashtag/${ segment.tag?.tag }">${ segment.text }</a>`;
            } else {
                markdown += segment.text;
            }
        }
        // End from the docs.

        // Used to have encode() here.  Can't now with markdown, and I don't know what it was fixing, but I feel I'll find out...
        return markdown;
    }

    protected getEmbed() : AppBskyEmbedImages.View | AppBskyEmbedVideo.View | AppBskyEmbedExternal.View | AppBskyEmbedRecord.View
        | AppBskyEmbedRecordWithMedia.View | { $type: string; [k: string]: unknown } | null | undefined {
        return (this.getBase() as PostView).embed;
    }

    getLinkCard(): StatusLink | null {
        const embed = this.getEmbed();
        if (embed == null) {
            return null;
        }

        if (!isExternalView(embed) && !isExternalMain(embed)) {
            return null;
        }
        const linkEmbed = embed as AppBskyEmbedExternal.View;

        if (linkEmbed.external.uri.includes(".gif?")) {
            return null;
        }

        const link = linkEmbed.external;
        return new StatusLink(link.uri, link.title, link.description, link.thumb);
    }


    // ---------------------------------------
    // ~~~~~| Media |~~~~~

    getImages(): StatusMedia[] {
        let embed = this.getEmbed();
        if (embed == null) {
            return [];
        }

        if (isRecordWithMediaView(embed)) {
            embed = embed.media;
        }

        if (!(isImageView(embed))) {
            return [];
        }

        const imagesEmbed = embed as AppBskyEmbedImages.View;
        return imagesEmbed.images
            .map(image => new StatusMedia(image.fullsize));
    }

    getAnimatedImages(): StatusMedia[] {
        let embed = this.getEmbed();
        if (embed == null) {
            return [];
        }

        if (isRecordWithMediaView(embed)) {
            embed = embed.media;
        }

        if (!(isExternalView(embed))) {
            return [];
        }
        const linkEmbed = embed as AppBskyEmbedExternal.View;

        if (!linkEmbed.external.uri.includes(".gif?")) {
            return [];
        }

        const link = linkEmbed.external;
        return [new StatusMedia(link.uri, 0, 0)];
    }

    getVideos(): StatusMedia[] {
        let embed = this.getEmbed();
        if (embed == null) {
            return [];
        }

        if (isRecordWithMediaView(embed)) {
            embed = embed.media;
        }

        if (!isVideoView(embed)) {
            return [];
        }

        const video = embed as AppBskyEmbedVideo.View;
        return [new StatusMedia(video.playlist, video.aspectRatio?.height, video.aspectRatio?.width)]
    }


    // ---------------------------------------
    // ~~~~~| Reply |~~~~~

    isReply(): boolean {
        return false;
    }

    getRepliedTo(): StatusPost | null {
        return null;
    }

    getRepliedToUrl(): string | null {
        return null;
    }

    async getRepliedToPosterDisplayName(): Promise<string | null | undefined> {
        return null;
    }

    isRepliedToMutual(): boolean {
        return true;
    }


    // ---------------------------------------
    // ~~~~~| Retweets |~~~~~

    isQuoteTweet(): boolean {
        return false;
    }

    getQuoteTweet(): StatusPost | null {
        return null;
    }

    isRabbitHole(): boolean {
        return false;
    }

    getRabbitHoleUrl(): string | null | undefined {
        return null;
    }

    isRetweet(): boolean {
        return false;
    }

    getRetweet(): StatusPost | null {
        return null;
    }

    // ---------------------------------------
    // ~~~~~| Util |~~~~~

    protected convertAtToUrl(at: string): string {
        const pieces = at.match(this.AT_URI_REGEX);
        return this.URL_FORMAT.replace("AT_ID", pieces?.at(1)!).replace("RKEY", pieces?.at(2)!);
    }
}

export type BlueRecord = {
    createdAt: string;
    embed? : AppBskyEmbedImages.View
        | AppBskyEmbedVideo.View
        | AppBskyEmbedExternal.View
        | AppBskyEmbedRecord.View
        | AppBskyEmbedRecordWithMedia.View
        | { $type: string; [k: string]: unknown }
    facets?: Facet[];
    text: string;
}
