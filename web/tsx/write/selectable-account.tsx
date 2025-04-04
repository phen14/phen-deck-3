// (K) ALL RIGHTS REVERSED - Reprint what you like

import "./create-post.css";

import Bluesky from "web/assets/bluesky.png";
import Mastodon from "web/assets/mastodon.png";

import { JSX } from "react";
import { DisplayAccount } from "../../../src/main/ts/api/account/display-account";

/**
 * Display the details of an account that be selected to post to.
 *
 * @param account Account details.
 * @param onSelect Function to run when an account is selected.
 * @constructor
 */
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
