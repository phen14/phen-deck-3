// (K) ALL RIGHTS REVERSED - Reprint what you like

import { AppBskyGraphGetFollows, AtpAgent, AtpSessionData, UnicodeString } from "@atproto/api";
import { ThreadViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { isLink } from "@atproto/api/dist/client/types/app/bsky/richtext/facet";
import { detectFacets } from "@atproto/api/dist/rich-text/detection";
import { AppBskyFeedPost } from "@atproto/api/src/client";
import * as AppBskyEmbedExternal from "@atproto/api/src/client/types/app/bsky/embed/external";
import urlMetadata from "url-metadata";
import { UserAccountProfile } from "../../../api/account/user-account-profile";
import { Server } from "../../../api/account/server";
import { UserAccount } from "../../../api/account/user-account";
import { AccountConfig } from "../../../config/account-config-type";
import { BlueskyRepliedToPost } from "../post/bluesky-replied-to-post";
import { BlueSkyAccess } from "./bluesky-access-type";
import { StatusPost } from "../../../api/post/status-post";
import { BlueskyPost } from "../post/bluesky-post";

/**
 * Instance of a Bluesky Account with account information and API access methods.
 */
export default class BlueskyAccount implements UserAccount {
    private static MAX_CHARS = 300;
    private static MAX_STATUSES = 40;
    private newestPostSeen = new Date(Date.UTC(1900,1,1));

    // Primary Key
    private ID = crypto.randomUUID();

    // Connection
    private access: BlueSkyAccess;
    private client: AtpAgent;
    private session: AtpSessionData | undefined;

    // Account Info
    private server: Server;
    private following: string[] = [];

    private myProfile: UserAccountProfile | undefined;


    // ===============================================================================================================
    // -----| Start |-----
    // ===================

    constructor(account: AccountConfig) {
        this.access = account.access as BlueSkyAccess;
        this.server = account.server;

        this.client = new AtpAgent({
            service: account.server.url,
            persistSession: (_evt, sess) => {
                this.session = sess;
            },
        });
    }

    /**
     * Initialize the account by logging in, loading profile information about the user, and loading the user's following list
     * so that replies can be filtered.
     */
    async initialize(): Promise<void> {
        if (Server == null) {
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
        if (this.session) {
            await this.client.resumeSession(this.session);
            return;
        }

        await this.client.login({
            identifier: this.access.user,
            password: this.access.accessToken,
        });
    }

    async loadMyProfile(): Promise<void> {
        await this.login();

        const bskyProfileResponse = await this.client.app.bsky.actor.getProfile({
            actor: this.client.assertDid,
        });
        const bskyProfile = bskyProfileResponse.data;

        this.myProfile = {
            id: bskyProfile.did,
            avatarUrl: bskyProfile.avatar,
            displayName: bskyProfile.displayName,
            handle: bskyProfile.handle,
            rawHandle: bskyProfile.handle
        }
    }

    async loadFollowing(): Promise<void> {
        const follows: string[] = [];
        let followingResponse: AppBskyGraphGetFollows.Response | undefined;

        do {
            console.log("Loading follows...", followingResponse?.data.cursor);
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

    resetCursor(): void {
        this.newestPostSeen = new Date(Date.UTC(1900,1,1));
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
    // -----| Actions |-----
    // =====================

    private async getLinkMetadata(uri: string): Promise<urlMetadata.Result> {
        const data = await urlMetadata(uri);
        console.log("Data", data);
        return data;
    }

    async post(postText: string): Promise<void> {
        const facets = detectFacets(new UnicodeString(postText));
        let linkCard: AppBskyEmbedExternal.Main | null = null;

        if (facets) {
            const links = facets
                .map((facet) => facet.features.find((feature) => !!isLink(feature)))
                .filter((found) => found !== undefined);
            if (links.length) {
                const link = links[0];
                const metadata = await this.getLinkMetadata(link.uri);

                linkCard = {
                    $type: "app.bsky.embed.external",
                    external: {
                        "description": metadata["og:description"],
                        "title": metadata["og:title"],
                        "uri": metadata["og:url"],
                    }
                }

                const thumb = metadata["og:image"];
                if (thumb) {
                    const blob = await fetch(thumb).then(r => r.blob())
                    const { data } = await this.client.uploadBlob(blob, { encoding: "image/jpeg" })
                    linkCard.external.thumb = data?.blob;
                }

                console.log("Link Card", linkCard);
            }
        }

        const params : Partial<AppBskyFeedPost.Record> = {
            facets,
            text: postText
        }

        if (linkCard) {
            params.embed = linkCard!;
        }

        try {
            await this.client.post(params);
        } catch (e) {
            console.error(`Failed to post to ${this.myProfile?.handle}.`, e);
        }
    }

    async getRepliedTo(postId: string): Promise<BlueskyRepliedToPost | null> {
        try {
            const postResponse = await this.client.app.bsky.feed.getPostThread({
                uri: postId
            });

            if (postResponse.data.thread.$type !== "app.bsky.feed.defs#threadViewPost") {
                return null;
            }

            return new BlueskyRepliedToPost(postResponse.data.thread as ThreadViewPost, this.myProfile!, this.getId());
        } catch (e) {
            console.error(`Error getting post ${postId}.`, e)
            return null;
        }
    }

    async getPosts(): Promise<StatusPost[]> {
        try {
            console.log(`Getting Bluesky timeline for ${ this.myProfile?.handle } since ${ this.newestPostSeen }`);
            await this.login();

            const postsResponse = await this.client.app.bsky.feed.getTimeline({
                limit: 100
            });

            const posts = postsResponse.data.feed.map(rawPost => new BlueskyPost(rawPost, this.myProfile!, this.getId()));

            const newPosts = posts.filter((item) => item.getTimestamp() > this.newestPostSeen);
            if (newPosts.length) {
                this.newestPostSeen = newPosts[0].getTimestamp();

                const getRepliedToPromises: Promise<BlueskyRepliedToPost | null>[] = [];
                const replies: BlueskyPost[] = [];
                for (const post of newPosts) {
                    if (post.isReply()) {
                        replies.push(post.isRetweet() ? post.getRetweet()! as BlueskyPost : post);
                        getRepliedToPromises.push(this.getRepliedTo(post.getReplyRef()?.parent.uri as string));
                    }
                }

                const repliedTos = await Promise.all(getRepliedToPromises);

                for (let i = 0; i < replies.length; ++i) {
                    if (repliedTos[i] != null) {
                        replies[i].setRepliedTo(repliedTos[i]!);
                    }
                }
            }

            console.log(`Returning ${ newPosts.length } posts.`);
            return newPosts;
        } catch (e) {
            console.error(`Failure getting posts for ${this.myProfile?.handle}.`, e);
            return [];
        }
    }

    async retweet(post: StatusPost): Promise<void> {
        // await Console.Out.WriteLineAsync("Reblogging...");
        // await client.Reblog(post.getId().ToString());
    }
}
