// (K) ALL RIGHTS REVERSED - Reprint what you like

import { AppBskyEmbedRecord } from "@atproto/api";
import * as AppBskyEmbedExternal from "@atproto/api/src/client/types/app/bsky/embed/external";
import * as AppBskyEmbedImages from "@atproto/api/src/client/types/app/bsky/embed/images";
import * as AppBskyEmbedRecordWithMedia from "@atproto/api/src/client/types/app/bsky/embed/recordWithMedia";
import * as AppBskyEmbedVideo from "@atproto/api/src/client/types/app/bsky/embed/video";
import { UserAccountProfile } from "../../../api/account/user-account-profile";
import { StatusPost } from "../../../api/post/status-post";
import { AbstractBlueskyPost, BlueRecord } from "./abstract-bluesky-post";
import { FeedViewPost, PostView, ReplyRef } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { isView as isRecordView, ViewRecord } from "@atproto/api/dist/client/types/app/bsky/embed/record";
import { BlueskyRepliedToPost } from "./bluesky-replied-to-post";

export class BlueskyQuotedPost extends AbstractBlueskyPost {
    private readonly blueskyStatus: AppBskyEmbedRecord.View;
    private readonly repliedTo: BlueskyRepliedToPost | null = null;

    public constructor(blueskyStatus: AppBskyEmbedRecord.View, account: UserAccountProfile, viewerAccountId: string, repliedTo: BlueskyRepliedToPost | null) {
        super(account, viewerAccountId);
        this.blueskyStatus = blueskyStatus;
        this.repliedTo = repliedTo;
    }

    protected getBase(): PostView | ViewRecord {
        return this.blueskyStatus.record as ViewRecord;
    }

    protected getRecord() : BlueRecord {
        return this.blueskyStatus.record.value as unknown as BlueRecord;
    }

    protected getEmbed(): AppBskyEmbedImages.View | AppBskyEmbedVideo.View | AppBskyEmbedExternal.View | AppBskyEmbedRecord.View
        | AppBskyEmbedRecordWithMedia.View | { $type: string; [k: string]: unknown } | null | undefined {
        // @ts-ignore It doesn't want to admit embeds is an array.
        return this.blueskyStatus.record.embeds ? this.blueskyStatus.record.embeds[0] : null;
    }


    // ---------------------------------------
    // ~~~~~| Viewer |~~~~~

    // ---------------------------------------
    // ~~~~~| Poster |~~~~~

    // ---------------------------------------
    // ~~~~~| Time |~~~~~

    // ---------------------------------------
    // ~~~~~| Content |~~~~~

    // ---------------------------------------
    // ~~~~~| Media |~~~~~

    // ---------------------------------------
    // ~~~~~| Reply |~~~~~

    isReply(): boolean {
        const value = this.blueskyStatus.record.value as FeedViewPost;
        return !!value.reply;
    }

    getReplyRef(): ReplyRef | undefined {
        const value = this.blueskyStatus.record.value as FeedViewPost;
        return value.reply;
    }

    getRepliedTo(): StatusPost | null {
        return this.repliedTo;
    }

    async getRepliedToPosterDisplayName(): Promise<string | null | undefined> {
        return this.repliedTo?.getPosterDisplayName();
    }

    // ---------------------------------------
    // ~~~~~| Retweets |~~~~~

    isRabbitHole(): boolean {
        return this.getEmbed() != null && isRecordView(this.getEmbed());
    }

    getRabbitHoleUrl(): string | null | undefined {
        if (!this.isRabbitHole()) {
            return null;
        }

        const embed = this.getEmbed() as AppBskyEmbedRecord.View;
        return this.convertPostAtToUrl(embed.record.uri as string);
    }
}
