// (K) ALL RIGHTS REVERSED - Reprint what you like

import { Quote, ShallowQuote } from "masto/dist/cjs/mastodon/entities/v1";
import { UserAccountProfile } from "../../../api/account/user-account-profile";
import { StatusPost } from "../../../api/post/status-post";
import { mastodon } from "masto";
import { StatusLink } from "../../../api/post/status-link";
import { StatusMedia } from "../../../api/post/status-media";

export class MastodonPost implements StatusPost {
    private readonly isQuoted: boolean;
    private readonly mastodonStatus: mastodon.v1.Status;
    private readonly quoted: MastodonPost | null = null;
    private readonly rabbitHoleId: string | null | undefined = null;
    private readonly retweet: MastodonPost | null;
    private readonly viewer: UserAccountProfile;
    private readonly viewerAccountId: string;

    protected rabbitHole: MastodonPost | null = null;
    protected repliedTo: MastodonPost | null = null;

    public constructor(mastadonStatus: mastodon.v1.Status, viewer: UserAccountProfile, viewerAccountId: string, isQuoted = false) {
        if (!mastadonStatus || !viewer || !viewerAccountId) {
            throw new Error("Required fields missing.");
        }

        this.isQuoted = isQuoted;
        this.mastodonStatus = mastadonStatus;
        this.viewer = viewer;
        this.viewerAccountId = viewerAccountId;

        if (!!this.mastodonStatus.quote) {
            if (this.isQuoted) {
                const quoteWrapper = this.mastodonStatus.quote as ShallowQuote;
                this.rabbitHoleId = quoteWrapper.quotedStatusId;
            } else {
                const quoteWrapper = this.mastodonStatus.quote as Quote;
                this.quoted = new MastodonPost(quoteWrapper.quotedStatus!, this.viewer, this.viewerAccountId, true);
            }
        }

        this.retweet = this.isRetweet() ? new MastodonPost(this.mastodonStatus.reblog!, this.viewer, this.viewerAccountId) : null;
    }

    getId(): string {
        return this.mastodonStatus.id;
    }

    getCid(): string {
        return "";
    }

    getUrl(): string {
        return this.mastodonStatus.url ?? "";
    }

    getViewer(): UserAccountProfile {
        return this.viewer;
    }

    getViewerAccountId(): string {
        return this.viewerAccountId;
    }

    getRaw(): Object {
        return this.mastodonStatus;
    }

    getRawString(): string {
        return JSON.stringify(this.mastodonStatus);
    }

    setRabbitHole(rabbitHole: MastodonPost): void {
        console.log('Setting rabbit hole', rabbitHole);
        this.rabbitHole = rabbitHole;
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

    getPosterUrl(): string {
        return this.mastodonStatus.account.url;
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
        return !!this.mastodonStatus.quote && 'quotedStatus' in this.mastodonStatus.quote;
    }

    getQuoteTweet(): StatusPost | null {
        return this.quoted;
    }

    isRabbitHole(): boolean {
        return !!this.rabbitHoleId;
    }

    getRabbitHoleId() : string | null | undefined {
        return this.rabbitHoleId;
    }

    getRabbitHoleUrl(): string | null | undefined {
        console.log('Getting rabbit hole URL', this.rabbitHole);
        console.log('Getting rabbit hole URL', this.rabbitHole?.getUrl());
        return this.rabbitHole?.getUrl() ?? null;
    }

    isRetweet(): boolean {
        return this.mastodonStatus.reblog != null;
    }

    getRetweet(): StatusPost | null {
        return this.retweet;
    }
}
