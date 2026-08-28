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
    private readonly AUTHOR_URL_FORMAT = "https://bsky.app/profile/AT_ID/";
    private readonly POST_AT_URI_REGEX = "at://(.*)/app.bsky.feed.post/(.*)";
    private readonly POST_URL_FORMAT = "https://bsky.app/profile/AT_ID/post/RKEY";

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

    getRawString(): string {
        try {
            return JSON.stringify(this.getBase());
        } catch (ignored) {
            return "";
        }
    }

    getUrl(): string {
        return this.convertPostAtToUrl(this.getBase().uri);
    }

    // ---------------------------------------
    // ~~~~~| Viewer |~~~~~

    getViewer(): UserAccountProfile {
        return this.viewer;
    }

    getViewerAccountId(): string {
        return this.viewerAccountId;
    }

    hasViewerRetweeted(): boolean {
        return false;
    }

    // ---------------------------------------
    // ~~~~~| Poster |~~~~~

    getPosterAvatarUrl(): string | undefined {
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

    getPosterUrl(): string {
        return this.convertDidToAuthorUrl(this.getBase().author?.did);
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
        if (!this.getRecord()) {
            return "";
        }

        const text = this.getRecord()?.text ?? "";
        const facets = this.getRecord().facets;
        const rt = new RichText({text, facets});

        // Mostly from the docs
        let markdown = "";
        for (const segment of rt.segments()) {
            if (segment.isLink()) {
                markdown += `<a href="${ segment.link?.uri }">${ segment.text }</a>`;
            } else if (segment.isMention()) {
                markdown += `<a href="https://bsky.app/profile/${ segment.mention?.did }">${ encode(segment.text) }</a>`;
            } else if (segment.isTag()) {
                markdown += `<a href="https://bsky.app/hashtag/${ segment.tag?.tag }">${ encode(segment.text) }</a>`;
            } else {
                markdown += encode(segment.text);
            }
        }
        // End from the docs.

        return markdown;
    }

    protected getEmbed() : AppBskyEmbedImages.View | AppBskyEmbedVideo.View | AppBskyEmbedExternal.View | AppBskyEmbedRecord.View
        | AppBskyEmbedRecordWithMedia.View | { $type: string; [k: string]: unknown } | undefined {
        return (this.getBase() as PostView).embed;
    }

    getLinkCard(): StatusLink | undefined {
        const embed = this.getEmbed();
        if (!embed) {
            return undefined;
        }

        const isNotExternal = !isExternalView(embed);
        const isNotExternalMain = !isExternalMain(embed);
        const isNotRecordWithMediaOtherThanALink = !isRecordWithMediaView(embed) || !isExternalView(embed.media);

        if (isNotExternal && isNotExternalMain && isNotRecordWithMediaOtherThanALink) {
            return undefined;
        }
        const linkView = (isRecordWithMediaView(embed) ? embed.media : embed) as AppBskyEmbedExternal.View;
        const link = linkView.external;

        if (link.uri.includes(".gif?")) {
            return undefined;
        }

        return new StatusLink(link.uri, link.title, link.description, link.thumb);
    }


    // ---------------------------------------
    // ~~~~~| Media |~~~~~

    getImages(): StatusMedia[] {
        let embed = this.getEmbed();
        if (!embed) {
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
        if (!embed) {
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
        if (!embed) {
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

    getRepliedTo(): StatusPost | undefined {
        return undefined;
    }

    getRepliedToUrl(): string | undefined {
        return undefined;
    }

    async getRepliedToPosterDisplayName(): Promise<string | undefined> {
        return undefined;
    }

    isRepliedToMutual(): boolean {
        return true;
    }


    // ---------------------------------------
    // ~~~~~| Retweets |~~~~~

    isQuoteTweet(): boolean {
        return false;
    }

    getQuoteTweet(): StatusPost | undefined {
        return undefined;
    }

    isRabbitHole(): boolean {
        return false;
    }

    getRabbitHoleUrl(): string | undefined {
        return undefined;
    }

    isRetweet(): boolean {
        return false;
    }

    getRetweet(): StatusPost | undefined {
        return undefined;
    }

    // ---------------------------------------
    // ~~~~~| Util |~~~~~

    protected convertPostAtToUrl(at: string): string {
        const pieces = at.match(this.POST_AT_URI_REGEX);
        return this.POST_URL_FORMAT.replace("AT_ID", pieces?.at(1)!).replace("RKEY", pieces?.at(2)!);
    }

    protected convertDidToAuthorUrl(did: string): string {
        return this.AUTHOR_URL_FORMAT.replace("AT_ID", did);
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
