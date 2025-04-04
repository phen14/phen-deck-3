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
    selected: boolean;
    service: string;
};

/**
 * Load the necessary data from a UserAccount to build a DisplayAccount.
 *
 * @param account
 */
export const convertAccountToDisplayAccount = (account : UserAccount | null): DisplayAccount | null => {
    if (!account) {
        return null;
    }

    return {
        ...account.getMyProfile(),
        accountId: account.getId(),
        postLength: account.getMaximumPostLength(),
        selected: true,
        service: account.getService()
    };
}
