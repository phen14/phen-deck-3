// (K) ALL RIGHTS REVERSED - Reprint what you like

import { AppBskyGraphGetFollows, AtpAgent, AtpAgentLoginOpts, UnicodeString, $Typed } from "@atproto/api";
import { ThreadViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { isLink } from "@atproto/api/dist/client/types/app/bsky/richtext/facet";
import { detectFacets } from "@atproto/api/dist/rich-text/detection";
import { AppBskyFeedPost } from "@atproto/api/src/client";
import * as AppBskyEmbedExternal from "@atproto/api/src/client/types/app/bsky/embed/external";
import * as AppBskyFeedDefs from "@atproto/api/src/client/types/app/bsky/feed/defs";
import urlMetadata from "url-metadata";
import { UserAccountProfile } from "../../../api/account/user-account-profile";
import { Server } from "../../../api/account/server";
import { UserAccount } from "../../../api/account/user-account";
import { ActionedPost } from "../../../api/post/actioned-post";
import { AccountConfig } from "../../../config/account-config-type";
import { MessageSystem } from "../../../service/message-system";
import { BlueskyQuotedPost } from "../post/bluesky-quoted-post";
import { BlueskyRepliedToPost } from "../post/bluesky-replied-to-post";
import { BlueSkyAccess } from "./bluesky-access-type";
import { StatusPost } from "../../../api/post/status-post";
import { BlueskyPost } from "../post/bluesky-post";

/**
 * Instance of a Bluesky Account with account information and API access methods.
 */
export default class BlueskyAccount implements UserAccount {
    private static MAX_CHARS = 300;
    // private static MAX_STATUSES = 40;

    // Logger
    private log = new MessageSystem(BlueskyAccount.name);

    // Primary Key
    private ID = crypto.randomUUID();

    // Connection
    private access: BlueSkyAccess;
    private client: AtpAgent;

    // Account Info
    private server: Server;
    private following: string[] = [];

    private myProfile: UserAccountProfile | undefined;

    // Post record
    private postsSeen = new Set<string>();

    // ===============================================================================================================
    // -----| Start |-----
    // ===================

    constructor(account: AccountConfig) {
        this.access = account.access as BlueSkyAccess;
        this.server = account.server;

        this.client = new AtpAgent({
            service: account.server.url
        });
    }

    /**
     * Initialize the account by logging in, loading profile information about the user, and loading the user's following list
     * so that replies can be filtered.
     */
    async initialize(): Promise<void> {
        if (!Server) {
            throw new Error("Failed to initialize account.");
        }
        await this.login();
        await this.loadMyProfile();
        await this.loadFollowing();
    }

    /**
     *
     */
    async login() {
        if (this.client.session?.active) {
            return;
        }

        const account: AtpAgentLoginOpts = {
            identifier: this.access.user,
            password: this.access.accessToken
        };

        await this.client.login(account);
    }

    async loadMyProfile(): Promise<void> {
        await this.login();

        const bskyProfileResponse = await this.client.app.bsky.actor.getProfile({
            actor: this.client.assertDid
        });
        const bskyProfile = bskyProfileResponse.data;

        this.myProfile = {
            id: bskyProfile.did,
            accountId: this.ID,
            avatarUrl: bskyProfile.avatar,
            displayName: bskyProfile.displayName,
            handle: bskyProfile.handle,
            rawHandle: bskyProfile.handle
        };
    }

    async loadFollowing(): Promise<void> {
        const follows: string[] = [];
        let followingResponse: AppBskyGraphGetFollows.Response | undefined;

        do {
            followingResponse = await this.client.app.bsky.graph.getFollows({
                actor: this.client.assertDid,
                cursor: followingResponse?.data.cursor,
                limit: 100
            });

            follows.push(...followingResponse.data.follows.map((follow) => follow.handle));
        } while (followingResponse.data.cursor);

        follows.push(this.getUserHandle());

        this.following = follows;
    }

    getFollowing(): string[] {
        return this.following;
    }

    getId() {
        return this.ID;
    }


    // ===============================================================================================================
    // -----| Account Info |-----
    // ==========================

    getMyProfile(): UserAccountProfile {
        return this.myProfile!;
    }

    getUserHandle(): string {
        return this.access?.user ?? "";
    }

    getRawUserHandle(): string {
        return this.getUserHandle();
    }


    // ===============================================================================================================
    // -----| Service Info |-----
    // ==========================

    getService(): string {
        return "Bluesky";
    }

    getMaximumPostLength(): number {
        return BlueskyAccount.MAX_CHARS;
    }

    getUrl(): string {
        return this.server?.url ?? "";
    }


    // ===============================================================================================================
    // -----| User Actions |-----
    // ==========================

    async post(postText: string): Promise<void> {
        const facets = detectFacets(new UnicodeString(postText));
        let linkCard: $Typed<AppBskyEmbedExternal.Main> | undefined = undefined;

        console.log("Facets", facets);

        if (facets) {
            const links = facets
                .map((facet) => facet.features.find((feature) => isLink(feature)))
                .filter((found) => found !== undefined);

            console.log("Links", links);
            if (links.length) {
                const link = links[0];
                const metadata = await urlMetadata(link.uri);
                console.log("Metadata", metadata);

                let url: string = metadata["og:url"];
                if (!url || !url.length) {
                    url = metadata["url"];
                }

                linkCard = {
                    $type: "app.bsky.embed.external",
                    external: {
                        "description": metadata["og:description"],
                        "title": metadata["og:title"],
                        "uri": url
                    }
                };

                const thumb = metadata["og:image"];
                if (thumb) {
                    const blob = await fetch(thumb).then(r => r.blob());
                    const { data } = await this.client.uploadBlob(blob, { encoding: "image/jpeg" });
                    linkCard.external.thumb = data?.blob;
                }
            }
        }

        const params: Partial<AppBskyFeedPost.Record> = {
            facets,
            text: postText
        };

        if (linkCard) {
            params.embed = linkCard!;
        }

        try {
            await this.client.post(params);
            this.log.info(`Successfully posted to ${this.myProfile?.handle}`);
        } catch (e) {
            this.log.error(`Failed to post to ${ this.myProfile?.handle }.`, e);
        }
    }

    async getRepliedTo(postId: string): Promise<BlueskyRepliedToPost | undefined> {
        try {
            const postResponse = await this.client.app.bsky.feed.getPostThread({
                uri: postId
            });

            if (postResponse.data.thread.$type !== "app.bsky.feed.defs#threadViewPost") {
                return undefined;
            }

            return new BlueskyRepliedToPost(postResponse.data.thread as ThreadViewPost, this.myProfile!, this.getId());
        } catch (e) {
            this.log.error(`Error getting post ${ postId }.`, e);
            return undefined;
        }
    }

    async getPosts(): Promise<StatusPost[]> {
        try {
            this.log.debug(`Getting Bluesky timeline for ${ this.myProfile?.handle }.`);
            await this.login();

            const postsResponse = await this.client.app.bsky.feed.getTimeline({
                limit: 100
            });

            const unseenRawPosts: AppBskyFeedDefs.FeedViewPost[] = [];
            for (const post of postsResponse.data.feed) {
                const id = post.post.cid as string;
                if (!this.postsSeen.has(id)) {
                    this.postsSeen.add(id);
                    unseenRawPosts.push(post);
                } else {
                    this.log.debug(`Already seen ${id}`);
                }
            }

            if (!unseenRawPosts.length) {
                this.log.debug("Returning 0 Posts");
                return [];
            }

            const posts = unseenRawPosts.map(rawPost => new BlueskyPost(rawPost, this.myProfile!, this.getId()));

            const getRepliedToPromises: Promise<BlueskyRepliedToPost | undefined>[] = [];
            const replies: BlueskyPost[] = [];

            const getQuotedRepliedToPromises: Promise<BlueskyRepliedToPost | undefined>[] = [];
            const postsWithQuotedReplies: BlueskyPost[] = [];

            for (const post of posts) {
                if (post.isReply()) {
                    replies.push(post.isRetweet() ? post.getRetweet()! as BlueskyPost : post);
                    const replyRef = post.getReplyRef()?.parent as { uri: string };
                    getRepliedToPromises.push(this.getRepliedTo(replyRef.uri as string));
                }
                if (post.isQuoteTweet() && post.getQuoteTweet()!.isReply()) {
                    const quoted = post.getQuoteTweet()! as BlueskyQuotedPost;
                    postsWithQuotedReplies.push(post);
                    const replyRef = quoted.getReplyRef()?.parent as { uri: string };
                    getQuotedRepliedToPromises.push(this.getRepliedTo(replyRef.uri as string));
                }
            }

            const repliedTos = await Promise.all(getRepliedToPromises);
            const quotedRepliedTos = await Promise.all(getQuotedRepliedToPromises);

            for (let i = 0; i < replies.length; ++i) {
                if (!!repliedTos[i]) {
                    replies[i].setRepliedTo(repliedTos[i]!);
                } else {
                    this.log.warn(`Reply for post ${ replies[i].getId() } by ${ replies[i].getPosterHandle() } at ${ replies[i].getTimestamp() } not found.`);
                }
            }

            for (let i = 0; i < postsWithQuotedReplies.length; ++i) {
                if (!!quotedRepliedTos[i]) {
                    postsWithQuotedReplies[i].setQuotedRepliedTo(quotedRepliedTos[i]!);
                } else {
                    this.log.warn(`Reply for quoted post ${ postsWithQuotedReplies[i].getId() } by ${ postsWithQuotedReplies[i].getPosterHandle() } at ${ postsWithQuotedReplies[i].getTimestamp() } not found.`);
                }
            }

            this.log.debug(`Returning ${ posts.length } posts.`);
            return posts;
        } catch (e) {
            this.log.error(`Failure getting posts for ${ this.myProfile?.handle }.`, e);
            return [];
        }
    }

    async retweet(post: ActionedPost): Promise<void> {
        this.log.debug("Reblogging (B)...", post);
        try {
            await this.client.repost(post.id, post.cid);
            this.log.info(`Successfully reposted to ${this.myProfile?.handle}.`);
        } catch (e) {
            this.log.error(`Failed to retweet to ${this.myProfile?.handle}.`, e);
        }
    }


    // ===============================================================================================================
    // -----| Admin Actions |-----
    // ===========================

    forgetPosts(): void {
        this.log.debug("Clearing known posts.");
        this.postsSeen.clear();
    }

    resetCursor(): void {
        this.log.debug("Resetting cursor.");
        this.forgetPosts();
    }
}
