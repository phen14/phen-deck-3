// (K) ALL RIGHTS REVERSED - Reprint what you like

import { UserAccount } from "./user-account";
import { Map as ImmutableMap } from "immutable";

/**
 * Singleton store for loaded user accounts.
 */
export class Accounts {
    static #instance: Accounts;

    private accounts: Map<string, UserAccount> = new Map();

    // ====================================================================================================================================
    // -----| Initialization |-----
    // =============================

    private constructor() {

    }

    public static getInstance(): Accounts {
        if (!Accounts.#instance) {
            Accounts.#instance = new Accounts();
        }

        return Accounts.#instance;
    }



    // ====================================================================================================================================
    // -----| Account List Access |-----
    // =================================

    public add(account: UserAccount): void {
        this.accounts.set(account.getId(), account);
    }

    public get(id: string): UserAccount | undefined {
        return this.accounts.get(id);
    }

    public list(): UserAccount[] {
        return Array.from(this.accounts.values());
    }

    public map(): ImmutableMap<string, UserAccount> {
        return ImmutableMap<string, UserAccount>(this.accounts);
    }



    // ====================================================================================================================================
    // -----| Bulk Account Operations  |-----
    // ======================================

    /**
     * Clear the list of known posts in each account so the next repost of each will appear.
     */
    public forgetPosts(): void {
        for (let account of this.accounts.values()) {
            account.forgetPosts();
        }
    }

    /**
     * Reset the timeline cursor in each account to its default value.
     */
    public resetCursors(): void {
        for (let account of this.accounts.values()) {
            account.resetCursor();
        }
    }
}
