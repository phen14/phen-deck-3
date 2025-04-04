// (K) ALL RIGHTS REVERSED - Reprint what you like

import { UserAccountProfile } from "../../../api/account/user-account-profile";
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

    async getRepliedToPosterDisplayName(): Promise<string | null | undefined> {
        if (!this.isReply()) {
            return null;
        }

        const parent = this.blueskyStatus.parent as ThreadViewPost;
        return parent.post.author.displayName;
    }

    // ---------------------------------------
    // ~~~~~| Retweets |~~~~~

}
