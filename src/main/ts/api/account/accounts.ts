import { UserAccount } from "./user-account";
import { Map as ImmutableMap } from "immutable";

export class Accounts {
    static #instance: Accounts;

    private accounts: Map<string, UserAccount> = new Map();

    private constructor() {

    }

    public static getInstance(): Accounts {
        if (!Accounts.#instance) {
            Accounts.#instance = new Accounts();
        }

        return Accounts.#instance;
    }

    public add(account: UserAccount): void {
        this.accounts.set(account.getId(), account);
    }

    public get(id: string): UserAccount | undefined {
        return this.accounts.get(id);
    }

    public list(): UserAccount[] {
        return Array.from(this.accounts.values());
    }

    public map(): ImmutableMap<string, UserAccount> {
        return ImmutableMap<string, UserAccount>(this.accounts);
    }
}
