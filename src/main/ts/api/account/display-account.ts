import { UserAccount } from "./user-account";
import { UserAccountProfile } from "./user-account-profile";

export type DisplayAccount = UserAccountProfile & {

    // Service Info
    accountId: string;
    postLength: number;
    selected: boolean;
    service: string;
};

export const convertAccountToDisplayAccount = (account : UserAccount | null): DisplayAccount | null => {
    if (!account) {
        return null;
    }

    return {
        ...account.getMyProfile(),
        accountId: account.getId(),
        postLength: account.getPostLength(),
        selected: true,
        service: account.getService()
    };
}
