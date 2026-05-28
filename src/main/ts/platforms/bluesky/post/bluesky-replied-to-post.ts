// (K) ALL RIGHTS REVERSED - Reprint what you like

import { UserAccountProfile } from "../../../api/account/user-account-profile";
import { StatusPost } from "../../../api/post/status-post";
import { AbstractBlueskyPost, BlueRecord } from "./abstract-bluesky-post";
import { PostView, ThreadViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";

export class BlueskyRepliedToPost extends AbstractBlueskyPost {
    private readonly blueskyStatus: ThreadViewPost;

    public constructor(blueskyStatus: ThreadViewPost, account: UserAccountProfile, viewerAccountId: string) {
        super(account, viewerAccountId);
        this.blueskyStatus = blueskyStatus;
    }

    protected getBase(): PostView {
        return this.blueskyStatus.post;
    }

    protected getRecord(): BlueRecord {
        return this.getBase().record as BlueRecord;
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
        return !!(this.blueskyStatus.parent && this.blueskyStatus.parent.$type === 'app.bsky.feed.defs#threadViewPost');
    }

    getRepliedToUrl(): string | undefined {
        if (!this.isReply()) {
            return undefined;
        }

        const parent = this.blueskyStatus.parent as ThreadViewPost;
        return this.convertPostAtToUrl(parent.post.uri);
    }

    async getRepliedToPosterDisplayName(): Promise<string | undefined> {
        if (!this.isReply()) {
            return undefined;
        }

        const parent = this.blueskyStatus.parent as ThreadViewPost;
        return parent.post.author.displayName;
    }

    // ---------------------------------------
    // ~~~~~| Retweets |~~~~~

}
