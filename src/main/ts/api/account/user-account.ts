import { UUID } from "../../util/uuid";
import { StatusPost } from "../post/status-post";
import { UserAccountProfile } from "./user-account-profile";

export interface UserAccount {
    // Primary Key
    getId(): UUID;

    // Start
    initialize(): Promise<void>;
    resetCursor(): void;

    // Account Info
    getMyProfile(): UserAccountProfile;
    getRawUserHandle(): string;
    getUserHandle(): string;

    // Service Info
    getPostLength(): number;
    getService(): string;
    getUrl(): string;

    // Actions
    post(postText: string): void;
    getPosts(): Promise<StatusPost[]>;
    retweet(post:StatusPost): Promise<void>;
}
