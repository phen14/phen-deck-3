// (K) ALL RIGHTS REVERSED - Reprint what you like

import "./create-post.css";

import { JSX, useState } from "react";
import { DisplayAccount } from "../../../src/main/ts/api/account/display-account";
import { Channels } from "../../../src/main/ts/app/preload";
import { getElectron } from "../util/get-electron";
import { SelectableAccount } from "./selectable-account";

/**
 * Display the list of accounts that can be posted to.
 *
 * @param onSelect Function to run when an account is selected.
 * @constructor
 */
export function AccountSelection({ onSelect }: { onSelect: Function }): JSX.Element {
    const [data, setData] = useState<Map<string, DisplayAccount>>(new Map());

    getElectron().ipcRenderer.on("getAccounts" as Channels, (arg) => {
        const accounts = arg as DisplayAccount[];
        const map: Map<string, DisplayAccount> = new Map();
        accounts.forEach(account => map.set(account.accountId, account));
        setData(map);

        if (onSelect) {
            onSelect([...map.values()]);
        }
    });

    const handleSelect = (id: string) => {
        console.log(`HandleSelect(${id})`);

        const copy = new Map(data);
        const targetedAccount = copy.get(id);
        if (!targetedAccount) {
            console.error(`Selectable account [${ id }] does not exist.`);
            return;
        }

        targetedAccount.selected = !targetedAccount.selected;
        setData(copy);

        if (onSelect) {
            onSelect([...data.values()]);
        }
    };

    const accounts = [...data.values()];
    const rows = accounts.map((account) => (
        <SelectableAccount account={ account } key={account.accountId} onSelect={ handleSelect } />
    ));

    return (
        <div className="selectAccountsWrapper">
            <h3>Post to Accounts</h3>
            { rows }
        </div>
    );
}
