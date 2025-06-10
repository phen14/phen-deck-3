// (K) ALL RIGHTS REVERSED - Reprint what you like

import { UserAccountProfile } from "../../../api/account/user-account-profile";
import { StatusPost } from "../../../api/post/status-post";
import { mastodon } from "masto";
import { StatusLink } from "../../../api/post/status-link";
import { StatusMedia } from "../../../api/post/status-media";

export class MastodonPost implements StatusPost {
    private readonly mastodonStatus: mastodon.v1.Status;
    private readonly retweet: MastodonPost | null;
    private readonly viewer: UserAccountProfile;
    private readonly viewerAccountId: string;

    protected repliedTo: MastodonPost | null = null;

    public constructor(mastadonStatus: mastodon.v1.Status, viewer: UserAccountProfile, viewerAccountId: string) {
        this.mastodonStatus = mastadonStatus;
        this.viewer = viewer;
        this.viewerAccountId = viewerAccountId;

        this.retweet = this.isRetweet() ? new MastodonPost(this.mastodonStatus.reblog!, this.viewer, this.viewerAccountId) : null;
    }

    getId(): string {
        return this.mastodonStatus.id;
    }

    getUrl(): string {
        return this.mastodonStatus.url ?? "";
    }

    getViewer(): UserAccountProfile {
        return this.viewer;
    }

    getRaw(): string {
        return JSON.stringify(this.mastodonStatus);
    }

    setRepliedTo(repliedTo: MastodonPost): void {
        this.repliedTo = repliedTo;
    }


    // ---------------------------------------
    // ~~~~~| Viewer |~~~~~

    hasViewerRetweeted(): boolean {
        return this.mastodonStatus.reblogged ?? false;
    }

    // ---------------------------------------
    // ~~~~~| Poster |~~~~~

    getPosterAvatarUrl(): string {
        return this.mastodonStatus.account.avatar;
    }

    getPosterDisplayName(): string {
        return this.mastodonStatus.account.displayName;
    }

    getPosterHandle(): string {
        return this.mastodonStatus.account.acct;
    }

    getPosterService(): string {
        return "Mastodon";
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
        return new Date(Date.parse(this.mastodonStatus.createdAt));
    }


    // ---------------------------------------
    // ~~~~~| Content |~~~~~

    getPostText(): string {
        return this.mastodonStatus.content ?? "";
    }

    getLinkCard(): StatusLink | null {
        const card = this.mastodonStatus.card;

        if (!card) {
            return null;
        }

        return new StatusLink(card.url, card.title, card.description, card.image);
    }


    // ---------------------------------------
    // ~~~~~| Media |~~~~~

    getImages(): StatusMedia[] {
        const attachments = this.mastodonStatus.mediaAttachments;
        if (!attachments) {
            return [];
        }

        return attachments.filter(attachment => attachment.type == "image")
            .map(attachment => new StatusMedia(attachment.previewUrl ?? attachment.remoteUrl, attachment.meta?.original?.height, attachment.meta?.original?.width));
    }

    getAnimatedImages(): StatusMedia[] {
        const attachments = this.mastodonStatus.mediaAttachments;
        if (!attachments) {
            return [];
        }

        return attachments.filter(attachment => attachment.type == "gifv")
            .map(attachment => new StatusMedia(attachment.url ?? attachment.remoteUrl!, attachment.meta?.original?.height, attachment.meta?.original?.width));
    }

    getVideos(): StatusMedia[] {
        const attachments = this.mastodonStatus.mediaAttachments;
        if (!attachments) {
            return [];
        }

        return attachments.filter(attachment => attachment.type == "video")
            .map(attachment => new StatusMedia(attachment.url ?? attachment.remoteUrl!, attachment.meta?.original?.height, attachment.meta?.original?.width));
    }


    // ---------------------------------------
    // ~~~~~| Reply |~~~~~

    isReply(): boolean {
        return !!this.mastodonStatus.inReplyToId;
    }

    getInRepliedToId(): string | null {
        return this.mastodonStatus.inReplyToId ?? null;
    }

    getRepliedTo(): StatusPost | null {
        return this.repliedTo;
    }

    getRepliedToUrl(): string | null {
        return this.repliedTo?.getUrl() ?? null;
    }

    async getRepliedToPosterDisplayName(): Promise<string | null> {
        return (this.getRepliedTo())?.getPosterDisplayName() ?? null;
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
        return this.mastodonStatus.reblog != null;
    }

    getRetweet(): StatusPost | null {
        return this.retweet;
    }
}
