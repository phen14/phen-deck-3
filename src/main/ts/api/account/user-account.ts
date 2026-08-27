// (K) ALL RIGHTS REVERSED - Reprint what you like

import { UUID } from "../../util/uuid";
import { ActionedPost } from "../post/actioned-post";
import { StatusPost } from "../post/status-post";
import { UserAccountProfile } from "./user-account-profile";

/**
 * Interface for classes that define how to retrieve data about an account from their respective models and otherwise interact with the service.
 */
export interface UserAccount {
    // ---------------------------------
    // ~~~~~| Primary Key |~~~~~

    getId(): UUID;

    // ---------------------------------
    // ~~~~~| Start |~~~~~

    /**
     * Run any steps needed to prepare the account to be used the way we wish to use it.
     */
    initialize(): Promise<void>;

    // ---------------------------------
    // ~~~~~| Account Info |~~~~~

    /**
     * Get the account information of the user.
     */
    getMyProfile(): UserAccountProfile;

    /**
     * Get the user handle as specified in the service's model.
     */
    getRawUserHandle(): string;

    /**
     * Get the user handle always including the server.
     */
    getUserHandle(): string;

    // ---------------------------------
    // ~~~~~| Account Options |~~~~~

    /**
     * Get if the account is one that should be selected for posting by default.
     */
    isPrimary(): boolean;

    // ---------------------------------
    // ~~~~~| Service Info |~~~~~

    getMaximumPostLength(): number;
    getService(): string;
    getUrl(): string;

    // ---------------------------------
    // ~~~~~| User Actions |~~~~~

    post(postText: string): void;
    getPosts(): Promise<StatusPost[]>;
    retweet(post: ActionedPost): Promise<void>;

    // ---------------------------------
    // ~~~~~| Admin Actions |~~~~~

    /**
     * Clear the list of known posts so the next repost of each will appear.
     */
    forgetPosts(): void;

    /**
     * Clear the "last post loaded" data for the service.
     */
    resetCursor(): void;
}
