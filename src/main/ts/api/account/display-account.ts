// (K) ALL RIGHTS REVERSED - Reprint what you like

import { UserAccount } from "./user-account";
import { UserAccountProfile } from "./user-account-profile";

/**
 * Information needed to display an account in the UI.
 */
export type DisplayAccount = UserAccountProfile & {

    // Service Info
    accountId: string;
    postLength: number;
    primary: boolean;
    selected: boolean;
    service: string;
};

/**
 * Load the necessary data from a UserAccount to build a DisplayAccount.
 *
 * @param account
 */
export const convertAccountToDisplayAccount = (account? : UserAccount): DisplayAccount | undefined => {
    if (!account) {
        return undefined;
    }

    return {
        ...account.getMyProfile(),
        accountId: account.getId(),
        postLength: account.getMaximumPostLength(),
        primary: account.isPrimary(),
        selected: account.isPrimary(),
        service: account.getService()
    };
}
