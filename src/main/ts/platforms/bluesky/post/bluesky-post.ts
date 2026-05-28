// (K) ALL RIGHTS REVERSED - Reprint what you like

import { Accounts } from "../../../api/account/accounts";
import { UserAccountProfile } from "../../../api/account/user-account-profile";
import { StatusPost } from "../../../api/post/status-post";
import { StatusMedia } from "../../../api/post/status-media";
import { FeedViewPost, PostView, ReasonRepost, ReplyRef } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { AppBskyEmbedImages, AppBskyEmbedRecord, AppBskyEmbedRecordWithMedia } from "@atproto/api";
import BlueskyAccount from "../account/bluesky-account";
import { AbstractBlueskyPost, BlueRecord } from "./abstract-bluesky-post";
import { isReasonRepost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { isView as isImageView } from "@atproto/api/dist/client/types/app/bsky/embed/images";
import { isView as isRecordView, ViewRecord } from "@atproto/api/dist/client/types/app/bsky/embed/record";
import { isView as isRecordWithMediaView } from "@atproto/api/dist/client/types/app/bsky/embed/recordWithMedia";
import { BlueskyQuotedPost } from "./bluesky-quoted-post";
import { BlueskyRepliedToPost } from "./bluesky-replied-to-post";

export class BlueskyPost extends AbstractBlueskyPost {
    private readonly blueskyStatus: FeedViewPost;
    private readonly isRetweeted: boolean;
    private readonly retweet: BlueskyPost | undefined;

    protected quotedRepliedTo: BlueskyRepliedToPost | undefined = undefined;
    protected retweetInfo: ReasonRepost | undefined;
    protected repliedTo: BlueskyRepliedToPost | undefined = undefined;

    public constructor(blueskyStatus: FeedViewPost, account: UserAccountProfile, viewerAccountId: string, isRetweeted: boolean = false) {
        super(account, viewerAccountId);
        this.blueskyStatus = blueskyStatus;
        this.isRetweeted = isRetweeted;
        this.retweetInfo = !isRetweeted && isReasonRepost(this.blueskyStatus.reason) ? (this.blueskyStatus.reason as ReasonRepost) : undefined;

        if (this.isRetweet()) {
            this.retweet = new BlueskyPost(this.blueskyStatus, this.viewer, this.viewerAccountId, true);
        } else {
            this.retweet = undefined;
        }
    }

    protected getBase(): PostView {
        return this.blueskyStatus.post;
    }

    protected getRecord(): BlueRecord {
        return this.getBase().record as BlueRecord;
    }

    setQuotedRepliedTo(repliedTo: BlueskyRepliedToPost): void {
        this.quotedRepliedTo = repliedTo;
    }

    setRepliedTo(repliedTo: BlueskyRepliedToPost): void {
        this.repliedTo = repliedTo;
    }


    getId(): string {
        return !!this.retweetInfo ? this.retweetInfo.uri as string : this.getBase().uri ?? "";
    }

    // ---------------------------------------
    // ~~~~~| Viewer |~~~~~

    // ---------------------------------------
    // ~~~~~| Poster |~~~~~

    getPosterAvatarUrl(): string | undefined {
        return !!this.retweetInfo ? this.retweetInfo.by?.avatar ?? undefined : super.getPosterAvatarUrl();
    }

    getPosterDisplayName(): string {
        return !!this.retweetInfo ? this.retweetInfo.by?.displayName ?? "" : super.getPosterDisplayName();
    }

    getPosterHandle(): string {
        return !!this.retweetInfo ? this.retweetInfo.by?.handle ?? "" : super.getPosterHandle();
    }

    getPosterUrl(): string {
        return !!this.retweetInfo ? this.convertDidToAuthorUrl(this.retweetInfo.by?.did) ?? "" : super.getPosterUrl();
    }


    // ---------------------------------------
    // ~~~~~| Time |~~~~~

    getTimestamp(): Date {
        const indexedAt = (!!this.retweetInfo ? this.retweetInfo.indexedAt : this.getBase().indexedAt);
        if (indexedAt) {
            return new Date(Date.parse(indexedAt));
        }

        return new Date(Date.UTC(1900, 1, 1));
    }


    // ---------------------------------------
    // ~~~~~| Content |~~~~~

    getPostText(): string {
        return !!this.retweetInfo ? "" : super.getPostText();
    }


    // ---------------------------------------
    // ~~~~~| Media |~~~~~

    getImages(): StatusMedia[] {
        if (!!this.retweetInfo) {
            return [];
        }

        let embed = this.getBase().embed;
        if (!embed) {
            return [];
        }

        if (this.isQuoteTweetWithMedia()) {
            const quotedTweetWithMedia = embed as AppBskyEmbedRecordWithMedia.View;
            embed = quotedTweetWithMedia?.media;
        }

        if (!(isImageView(embed))) {
            return [];
        }

        const imagesEmbed = embed as AppBskyEmbedImages.View;
        return imagesEmbed.images
            .map(image => new StatusMedia(image.fullsize));
    }

    getAnimatedImages(): StatusMedia[] {
        if (!!this.retweetInfo) {
            return [];
        }

        return super.getAnimatedImages();
    }

    getVideos(): StatusMedia[] {
        if (!!this.retweetInfo) {
            return [];
        }

        return super.getVideos();
    }


    // ---------------------------------------
    // ~~~~~| Reply |~~~~~

    isReply(): boolean {
        return !!this.blueskyStatus.reply;
    }

    getReplyRef(): ReplyRef | undefined {
        return this.blueskyStatus.reply;
    }

    getRepliedTo(): StatusPost | undefined {
        return this.repliedTo;
    }

    async getRepliedToPosterDisplayName(): Promise<string | undefined> {
        return this.repliedTo?.getPosterDisplayName();
    }

    isRepliedToMutual(): boolean {
        if (!this.isReply()) {
            return false;
        }

        if (this.isRetweet() || this.isRetweeted) {
            // If the reply has been RT'd, we always want to see it.
            return true;
        }

        const account = Accounts.getInstance().get(this.viewerAccountId);
        if (!account) {
            return false;
        }


        const replyParent = this.blueskyStatus.reply!.parent as PostView;
        const handle = replyParent.author?.handle;
        const follows = (account as BlueskyAccount).getFollowing();


        if (!handle || !follows) {
            return false;
        }

        return follows.includes(handle);
    }

    // ---------------------------------------
    // ~~~~~| Retweets |~~~~~

    isQuoteTweet(): boolean {
        const embed = this.blueskyStatus.post.embed;

        const recordViewEmbed = this.isBasicQuoteTweet();
        const recordMediaEmbed = this.isQuoteTweetWithMedia();
        if (recordViewEmbed) {
            const rve = embed as AppBskyEmbedRecord.View;
            const rveRecord = rve.record as ViewRecord;
            if (rveRecord.uri.includes("/app.bsky.feed.generator/")) {
                return false;
            }
        }
        return recordViewEmbed || recordMediaEmbed;
    }

    private isBasicQuoteTweet(): boolean {
        return !!this.blueskyStatus.post.embed && isRecordView(this.blueskyStatus.post.embed);
    }

    private isQuoteTweetWithMedia(): boolean {
        return !!this.blueskyStatus.post.embed && isRecordWithMediaView(this.blueskyStatus.post.embed);
    }

    getQuoteTweet(): StatusPost | undefined {
        if (this.isBasicQuoteTweet()) {
            const quotedTweet = this.blueskyStatus.post.embed! as AppBskyEmbedRecord.View;
            if (!quotedTweet?.record) {
                return undefined;
            }
            return new BlueskyQuotedPost(quotedTweet, this.viewer, this.viewerAccountId, this.quotedRepliedTo);
        }

        if (this.isQuoteTweetWithMedia()) {
            const quotedTweetWithMedia = this.blueskyStatus.post.embed! as AppBskyEmbedRecordWithMedia.View;
            const quotedTweet = quotedTweetWithMedia.record!;
            if (!quotedTweet?.record) {
                return undefined;
            }
            return new BlueskyQuotedPost(quotedTweet, this.viewer, this.viewerAccountId, this.quotedRepliedTo);
        }

        return undefined;
    }

    isRabbitHole(): boolean {
        return false;
    }

    isRetweet(): boolean {
        return !!this.retweetInfo;
    }

    getRetweet(): StatusPost | undefined {
        return this.retweet;
    }
}
