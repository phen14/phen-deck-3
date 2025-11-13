// (K) ALL RIGHTS REVERSED - Reprint what you like

import { createRestAPIClient, mastodon } from "masto";
import { UserAccountProfile } from "../../../api/account/user-account-profile";
import { Server } from "../../../api/account/server";
import { UserAccount } from "../../../api/account/user-account";
import { ActionedPost } from "../../../api/post/actioned-post";
import { AccountConfig } from "../../../config/account-config-type";
import { MastodonAccess } from "./mastodon-access-type";
import { StatusPost } from "../../../api/post/status-post";
import { MastodonPost } from "../post/mastodon-post";

export default class MastodonAccount implements UserAccount {
    private static MAX_STATUSES = 40;
    private maxChars = 500;
    private newestPostSeen = "0";

    // Primary Key
    private ID = crypto.randomUUID();

    // Connection
    private access: MastodonAccess;
    private client: mastodon.rest.Client;

    // Account Info
    private server: Server;
    private myProfile: UserAccountProfile | undefined;
    private handleServer = "";

    // ===============================================================================================================
    // -----| Start |-----
    // ===================

    constructor(account: AccountConfig) {
        this.access = account.access as MastodonAccess;
        this.server = account.server;

        this.client = createRestAPIClient({
            accessToken: account.access.accessToken,
            url: account.server.url
        });
    }

    async initialize(): Promise<void> {
        const instance = await this.client.v2.instance.fetch();
        this.maxChars = instance.configuration.statuses.maxCharacters;
        this.handleServer = instance.domain;

        await this.loadMyProfile();
    }

    async loadMyProfile(): Promise<UserAccountProfile> {
        const mastoProfile = await this.client.v1.accounts.verifyCredentials();

        this.myProfile =  {
            id: mastoProfile.id,
            accountId: this.ID,
            avatarUrl: mastoProfile.avatar,
            displayName: mastoProfile.displayName,
            handle: `${mastoProfile.username}@${this.handleServer}`,
            rawHandle: mastoProfile.username
        }

        return this.myProfile;
    }

    public resetCursor(): void {
        this.newestPostSeen = "0";
    }


    // ===============================================================================================================
    // -----| Account Info |-----
    // ==========================

    getId() {
        return this.ID;
    }

    getMyProfile(): UserAccountProfile {
        return this.myProfile!;
    }

    getUserHandle(): string {
        return this.myProfile?.handle ?? "";
    }

    getRawUserHandle(): string {
        return this.myProfile?.rawHandle ?? "";
    }

    // ===============================================================================================================
    // -----| Service Info |-----
    // ==========================

    getService(): string {
        return "Mastodon";
    }

    getMaximumPostLength(): number {
        return this.maxChars;
    }

    getUrl(): string {
        return this.server.url;
    }


    // ===============================================================================================================
    // -----| Actions |-----
    // =====================

    async post(postText: string): Promise<void> {
        const params : mastodon.rest.v1.CreateStatusParams = { status: postText };

        try {
            await this.client.v1.statuses.create(params)
        } catch (e) {
            console.error(`Failed to post to ${this.myProfile?.handle}.`, e);
        }
    }

    async fetchPostById(postId: string): Promise<MastodonPost | null> {
        const postResponse = await this.client.v1.statuses.fetch({
            id: [postId]
        });

        if (!postResponse.length) {
            return null;
        }

        return new MastodonPost(postResponse[0], this.myProfile!, this.getId());
    }

    async getPosts(): Promise<StatusPost[]> {
        try {
            console.log(`Getting Mastadon timeline for ${ this.myProfile?.handle } since ${ this.newestPostSeen }`);
            const rawPosts = await this.client.v1.timelines.home.list({
                limit: 100,
                sinceId: this.newestPostSeen
            });

            const posts = rawPosts.map(rawPost => new MastodonPost(rawPost, this.myProfile!, this.getId()));
            if (posts.length) {
                this.newestPostSeen = rawPosts[0].id;

                const getRepliedToPromises: Promise<MastodonPost | null>[] = [];
                const replies: MastodonPost[] = [];

                const getRabbitHolePromises: Promise<MastodonPost | null>[] = [];
                const quotes: MastodonPost[] = [];

                for (const post of posts) {
                    if (post.isReply()) {
                        replies.push(post);
                        getRepliedToPromises.push(this.fetchPostById(post.getInRepliedToId()!));
                    } else if (post.isRetweet() && post.getRetweet()?.isReply()) {
                        const retweet = post.getRetweet() as MastodonPost;
                        replies.push(retweet);
                        getRepliedToPromises.push(this.fetchPostById(retweet.getInRepliedToId()!));
                    } else if (!!post.getQuoteTweet() && post.getQuoteTweet()!.isRabbitHole()) {
                        const quote = post.getQuoteTweet() as MastodonPost;
                        quotes.push(quote);
                        getRabbitHolePromises.push(this.fetchPostById(quote.getRabbitHoleId()!));
                    }
                }

                const repliedTos = await Promise.all(getRepliedToPromises);

                const getRepliedToRepliedToPromises: Promise<MastodonPost | null>[] = [];
                const repliedToReplies: MastodonPost[] = [];
                for (let i = 0; i < replies.length; ++i) {
                    const repliedTo = repliedTos[i];
                    if (repliedTo != null) {
                        replies[i].setRepliedTo(repliedTos[i]!);

                        if (repliedTo.isReply()) {
                            repliedToReplies.push(repliedTo);
                            getRepliedToRepliedToPromises.push(this.fetchPostById(repliedTo.getInRepliedToId()!));
                        }
                    }
                }

                const rabbitHoles = await Promise.all(getRabbitHolePromises);
                for (let i = 0; i < quotes.length; ++i) {
                    if (quotes[i] != null) {
                        quotes[i].setRabbitHole(rabbitHoles[i]!);
                    }
                }

                const repliedToRepliedTos = await Promise.all(getRepliedToRepliedToPromises);
                for (let i = 0; i < repliedToReplies.length; ++i) {
                    if (repliedToRepliedTos[i] != null) {
                        repliedToReplies[i].setRepliedTo(repliedToRepliedTos[i]!);
                    }
                }
            }

            console.log(`Returning ${ posts.length } posts.`);
            return posts;
        } catch (e) {
            console.error(`Failure getting posts for ${this.myProfile?.handle}.`, e);
            return [];
        }
    }

    async retweet(post: ActionedPost): Promise<void> {
        console.log("Reblogging (M)...", post);
        try {
            await this.client.v1.statuses.$select(post.id).reblog();
        } catch (e) {
            console.error(`Failed to retweet to ${this.myProfile?.handle}.`, e);
        }
    }
}
