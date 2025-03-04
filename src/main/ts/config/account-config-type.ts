import { Server } from "../api/account/server";
import { BlueSkyAccess } from "../platforms/bluesky/account/bluesky-access-type";
import { MastodonAccess } from "../platforms/mastodon/account/mastodon-access-type";

export type AccountConfig = {
    type: string;
    access: BlueSkyAccess | MastodonAccess;
    server: Server;
}
