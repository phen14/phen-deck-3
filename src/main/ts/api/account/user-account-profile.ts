// (K) ALL RIGHTS REVERSED - Reprint what you like

/**
 * Basic identifying information about a user account.
 */
export type UserAccountProfile = {
    // Primary Key
    readonly id: string;

    // Account Info
    readonly avatarUrl: string | undefined;
    readonly displayName: string | undefined;
    readonly handle: string;
    readonly rawHandle: string;
}
