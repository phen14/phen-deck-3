// (K) ALL RIGHTS REVERSED - Reprint what you like

import { BrowserWindow, ipcMain } from "electron";
import { Accounts } from "../api/account/accounts";
import { convertAccountToDisplayAccount, DisplayAccount } from "../api/account/display-account";
import { UserAccount } from "../api/account/user-account";
import { ActionedPost } from "../api/post/actioned-post";
import { DisplayPost } from "../api/post/display-post";
import { StatusPost } from "../api/post/status-post";
import { SubmittedPost } from "../api/post/submitted-post";
import { SystemMessage } from "../api/system/system-message";
import { phenDeckConfig } from "../config/phen-deck-config";
import { shouldFilterOutPost } from "../service/post-filter";
import WebContents = Electron.WebContents;
import IpcMainEvent = Electron.IpcMainEvent;

const accounts = Accounts.getInstance();

export class ReactInterface {
    static #instance: ReactInterface;
    mainWindow: BrowserWindow | undefined = undefined;

    public static getInstance(): ReactInterface {
        if (!ReactInterface.#instance) {
            ReactInterface.#instance = new ReactInterface();
        }

        return ReactInterface.#instance;
    }

    private constructor() {
        ipcMain.on('getPosts', async (event) => {
            await this.getPosts(event.sender);
        })

        ipcMain.on('post', async (event, value: SubmittedPost) => {
            await this.post(event, value);
        });

        ipcMain.on('favorite', async (event, value: ActionedPost) => {
            await this.favorite(event, value);
        });
        ipcMain.on('retweet', async (event, value: ActionedPost) => {
            await this.retweet(event, value);
        });
    }

    /**
     * Setup the communication channels between the front and back ends of the app.
     *
     * @param main Application window object.
     */
     setMainWindow (main: BrowserWindow | undefined) {
        this.mainWindow = main;
    }

    /**
     * Communication channel to send changes in configuration to the front end.
     */
    sendUpdatedConfig (senderArg?: WebContents) {
        const sender = senderArg ?? this.mainWindow?.webContents;

        if (!sender) {
            console.error("Link to window not established.")
            return;
        }

        console.log("Sending config...");
        sender.send("updatedConfig", phenDeckConfig);
    }

    /**
     * Communication channel to send the account list to the front end.
     *
     * @param sender
     */
    getAccounts(sender: WebContents) {
        const accounts = Accounts.getInstance().list();
        const displayAccounts = accounts
            .map((account: UserAccount) => convertAccountToDisplayAccount(account))
            .filter((displayAccount?: DisplayAccount) => !!displayAccount);

        sender.send("getAccounts", displayAccounts);
    }

    /**
     * Communication channel to (eventually) send a batch of notifications to the front end.
     *
     * @param senderArg
     * @param oneTime
     */
    async getNotifications(senderArg?: WebContents, oneTime: boolean = false) {
        const sender = senderArg ?? this.mainWindow?.webContents;

        const notificationPromises: Promise<void>[] = [];
        accounts.list().forEach(account => {
            notificationPromises.push(account.getNotifications());
        });

        await Promise.all(notificationPromises);

        if (!oneTime) {
            setTimeout(() => this.getNotifications(sender), 120000)
        }
    }

    /**
     * Communication channel to send a batch of posts to the front end.
     *
     * @param senderArg
     * @param oneTime
     */
    async getPosts(senderArg?: WebContents, oneTime: boolean = false) {
        const sender = senderArg ?? this.mainWindow?.webContents;

        if (!sender) {
            console.error("Link to window not established.")
            return;
        }

        const posts: StatusPost[] = [];

        const postPromises: Promise<StatusPost[]>[] = [];
        accounts.list().forEach(account => {
            postPromises.push(account.getPosts());
        });

        const results = await Promise.all(postPromises);
        for (const result of results) {
            posts.push(...result);
        }

        // filter
        const filteredPosts = posts.filter((post: StatusPost) => !shouldFilterOutPost(post));
        console.log(`Filtered ${ posts.length - filteredPosts.length } of ${ posts.length } posts.`)

        // sort
        filteredPosts.sort((a: StatusPost, b: StatusPost) => a.getTimestamp().getTime() - b.getTimestamp().getTime());

        const conversionPromises: Promise<DisplayPost | undefined>[] = [];
        filteredPosts.forEach((post) => {
            conversionPromises.push(DisplayPost.convertStatusPostToDisplayPost(post));
        })
        const displayPosts = await Promise.all(conversionPromises);
        sender.send("getPosts", displayPosts);

        if (!oneTime) {
            setTimeout(() => this.getPosts(sender), 30000)
        }
    }

    /**
     * Communication channel to send a system message to the front end.
     *
     * @param systemMessage Message to send.
     * @param senderArg
     */
    async sendSystemMessage (systemMessage: SystemMessage, senderArg?: WebContents) {
        const sender = senderArg ?? this.mainWindow?.webContents;

        if (!sender) {
            console.error("Link to window not established.")
            return;
        }

        sender.send("systemMessage", systemMessage);
    }

    /**
     * Communication channel to send the post template list to the front end.
     *
     * @param sender
     */
    getPostTemplates (sender: WebContents) {
        sender.send("getPostTemplates", phenDeckConfig.compose.postTemplates);
    }


    /**
     * Communication for the front end to send a submitted post to the back end.
     *
     * @param event
     * @param value
     */
    async post (event: IpcMainEvent, value: SubmittedPost) {
        if (!value.text) {
            return;
        }

        const accountsLibrary = Accounts.getInstance();
        const accounts = value.accounts.map((account) => accountsLibrary.get(account));

        accounts.forEach((account => account?.post(value.text)));
    }

    /**
     * Communication for the front end to send a favorite to the back end.
     *
     * @param event
     * @param value
     */
    async favorite (event: IpcMainEvent, value: ActionedPost)  {
        const accountsLibrary = Accounts.getInstance();
        const accounts = value.accounts.map((account) => accountsLibrary.get(account));

        accounts.forEach((account => account?.favorite(value)));
    }


    /**
     * Communication for the front end to send a retweet to the back end.
     *
     * @param event
     * @param value
     */
    async retweet (event: IpcMainEvent, value: ActionedPost)  {
        const accountsLibrary = Accounts.getInstance();
        const accounts = value.accounts.map((account) => accountsLibrary.get(account));

        accounts.forEach((account => account?.retweet(value)));
    }

}
