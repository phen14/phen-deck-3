// (K) ALL RIGHTS REVERSED - Reprint what you like

import "./create-post.css";

import { JSX } from "react";
import { DisplayAccount } from "../../../src/main/ts/api/account/display-account";
import { SelectableAccount } from "./selectable-account";

/**
 * Display the list of accounts that can be posted to.
 *
 * @param accountMap Map of Account IDs to DisplayAccounts
 * @param onSelect Function to run when an account is selected.
 * @constructor
 */
export function AccountSelection({ accountMap, onSelect }: { accountMap: Map<string, DisplayAccount>, onSelect: Function }): JSX.Element {
    const handleSelect = (id: string) => {
        if (onSelect) {
            onSelect(id);
        }
    };

    const accounts = [...accountMap.values()];
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
