import "./create-post.css";

import Bluesky from "web/assets/bluesky.png";
import Mastodon from "web/assets/mastodon.png";

import { JSX } from "react";
import { DisplayAccount } from "../../../src/main/ts/api/account/display-account";

export function SelectableAccount({ account, onSelect }: { account: DisplayAccount, onSelect: Function }): JSX.Element {

    const handleSelect = () => {
        if (onSelect) {
            onSelect(account.accountId);
        }
    }

    const className = "selectableAccount " + (account.selected ? "selectedAccount" : "unselectedAccount");

    return (
        <div id={ account.accountId } className={ className } onClick={ handleSelect }>
            <div className="checkX">{ account.selected ? "✅" : "❌" }</div>
            <img className="accountAvatar" src={ account.avatarUrl } />
            <div className="accountName">{ account.displayName }</div>
            <div className="accountServiceIconAndHandle">
                <img className="serviceIcon" src={ account.service == "Bluesky" ? Bluesky : Mastodon } />
                <span className="accountHandle">{ account.handle }</span>
            </div>
        </div>
    );
}
