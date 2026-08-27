// (K) ALL RIGHTS REVERSED - Reprint what you like

import "./create-post.css";

import { JSX, useRef, useState } from "react";
import { DisplayAccount } from "../../../src/main/ts/api/account/display-account";
import { Channels } from "../../../src/main/ts/app/preload";
import { getElectron } from "../util/get-electron";
import { PostBox } from "./post-box";
import { AccountSelection } from "./account-selection";

/**
 * Display the form for submitting a post.
 *
 * @constructor
 */
export function CreatePost(): JSX.Element {
    const [accountMap, setAccountMap] = useState<Map<string, DisplayAccount>>(new Map());
    const [max, setMax] = useState<number>(0);
    const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

    getElectron().ipcRenderer.on("getAccounts" as Channels, (arg) => {
        const accounts = arg as DisplayAccount[];
        const map: Map<string, DisplayAccount> = new Map();
        accounts.forEach(account => map.set(account.accountId, account));
        setAccountMap(map);
    });

    const computeCurrentSelectedAccountSettings = () => {
        const selected = [...accountMap.values()]
            .filter(account => account.selected);
        const ids = selected.map((account: DisplayAccount) => account.accountId);
        setSelectedAccounts(ids);

        const maxes = selected
            .map(account => account.postLength);
        setMax(Math.min(...maxes));
    };

    const handleAccountSelectionChange = (id: string) => {
        const account = accountMap.get(id);
        if (!account) {
            console.error(`No account found for account ${id}`);
            return;
        }

        account.selected = !account.selected;
        computeCurrentSelectedAccountSettings();
    }

    const resetSelectedAccounts = () => {
        for (const account of accountMap.values()) {
            account.selected = account.primary;
        }

        setAccountMap(accountMap);
        computeCurrentSelectedAccountSettings();
    }

    return (
        <div className="createPostColumn">
            <div className="createPostHeader">
                <span>Create Post</span>
            </div>
            <AccountSelection accountMap={accountMap} onSelect={ handleAccountSelectionChange } />
            <PostBox max={ max } onPost={resetSelectedAccounts} onReset={resetSelectedAccounts} selectedAccounts={ selectedAccounts } />
        </div>
    );
}
