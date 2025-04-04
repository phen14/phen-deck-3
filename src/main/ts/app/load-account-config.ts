// (K) ALL RIGHTS REVERSED - Reprint what you like

import accountConfigList from "../../../../config/accounts.json";
import { Accounts } from "../api/account/accounts";
import BlueskyAccount from "../platforms/bluesky/account/bluesky-account";
import MastodonAccount from "../platforms/mastodon/account/mastodon-account";
import { AccountConfig } from "../config/account-config-type";

/**
 * Load accounts from the user's configuration file and store them in our global Accounts singleton.
 */
export const loadAccountConfig = async () => {
    const accounts = Accounts.getInstance();
    accountConfigList.forEach((accountConfig: AccountConfig) => {
        switch (accountConfig.type) {
            case "bluesky":
                accounts.add(new BlueskyAccount(accountConfig));
                break;
            case "mastodon":
                accounts.add(new MastodonAccount(accountConfig));
                break;
            default:
                console.error("Unsupported Platform " + accountConfig.type);
        }
    });

    const initPromises: Promise<void>[] = [];
    accounts.list().forEach(account => {
        initPromises.push(account.initialize());
    });

    await Promise.all(initPromises);
};
