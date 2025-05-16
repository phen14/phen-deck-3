// (K) ALL RIGHTS REVERSED - Reprint what you like

import { AppBskyEmbedRecord } from "@atproto/api";
import * as AppBskyEmbedExternal from "@atproto/api/src/client/types/app/bsky/embed/external";
import * as AppBskyEmbedImages from "@atproto/api/src/client/types/app/bsky/embed/images";
import * as AppBskyEmbedRecordWithMedia from "@atproto/api/src/client/types/app/bsky/embed/recordWithMedia";
import * as AppBskyEmbedVideo from "@atproto/api/src/client/types/app/bsky/embed/video";
import { UserAccountProfile } from "../../../api/account/user-account-profile";
import { AbstractBlueskyPost, BlueRecord } from "./abstract-bluesky-post";
import { PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { ViewRecord } from "@atproto/api/dist/client/types/app/bsky/embed/record";

export class BlueskyQuotedPost extends AbstractBlueskyPost {
    private readonly blueskyStatus: AppBskyEmbedRecord.View;

    public constructor(blueskyStatus: AppBskyEmbedRecord.View, account: UserAccountProfile, viewerAccountId: string) {
        super(account, viewerAccountId);
        this.blueskyStatus = blueskyStatus;
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

    // async getRepliedToPosterDisplayName(): Promise<string | null | undefined> {
    //     if (!this.isReply()) {
    //         return null;
    //     }
    //
    //     return this.blueskyStatus. parent.post.author.displayName;
    // }

    // ---------------------------------------
    // ~~~~~| Retweets |~~~~~

}
