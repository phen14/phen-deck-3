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

    return (
        <tr id={ account.accountId } className={ account.selected ? "selectedAccount" : "unselectedAccount" } onClick={ handleSelect }>
            <td>{ account.selected ? "✅" : "❌" }</td>
            <td>
                <img className="accountAvatar" src={ account.avatarUrl }/>
            </td>
            <td>
                <div className="accountName">{ account.displayName }</div>
                <img className="serviceIcon" src={ account.service == "Bluesky" ? Bluesky : Mastodon }/>
                <span className="accountHandle">{ account.handle }</span>
            </td>
        </tr>
    );
}
