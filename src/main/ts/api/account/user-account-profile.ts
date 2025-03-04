export type UserAccountProfile = {
    // Primary Key
    readonly id: string;

    // Account Info
    readonly avatarUrl: string | undefined;
    readonly displayName: string | undefined;
    readonly handle: string;
    readonly rawHandle: string;
}
