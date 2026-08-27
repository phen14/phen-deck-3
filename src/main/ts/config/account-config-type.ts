// (K) ALL RIGHTS REVERSED - Reprint what you like

import { Server } from "../api/account/server";
import { BlueSkyAccess } from "../platforms/bluesky/account/bluesky-access-type";
import { MastodonAccess } from "../platforms/mastodon/account/mastodon-access-type";
import { AccountOptions } from "./account-options-type";

/**
 * Class representation of the account data in the configuration file.
 */
export type AccountConfig = {
    type: string;
    access: BlueSkyAccess | MastodonAccess;
    options: AccountOptions;
    server: Server;
}
