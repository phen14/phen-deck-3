// (K) ALL RIGHTS REVERSED - Reprint what you like

import "./create-post.css";

import { JSX, useState } from "react";
import { DisplayAccount } from "../../../src/main/ts/api/account/display-account";
import { PostBox } from "./post-box";
import { AccountSelection } from "./account-selection";

/**
 * Display the form for submitting a post.
 *
 * @constructor
 */
export function CreatePost(): JSX.Element {
    const [max, setMax] = useState<number>(0);
    const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

    const handleAccountSelectionChange = (accounts: DisplayAccount[]) => {
        const selected = accounts
            .filter(account => account.selected);
        const ids = selected.map((account: DisplayAccount) => account.accountId);
        setSelectedAccounts(ids);

        const maxes = selected
            .map(account => account.postLength);
        setMax(Math.min(...maxes));
    };

    return (
        <div className="createPostColumn">
            <div className="createPostHeader">
                <span>Create Post</span>
            </div>
            <AccountSelection onSelect={ handleAccountSelectionChange } />
            <PostBox max={ max } selectedAccounts={ selectedAccounts } />
        </div>
    );
}
