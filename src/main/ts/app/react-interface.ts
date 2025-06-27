// (K) ALL RIGHTS REVERSED - Reprint what you like

import { BrowserWindow, ipcMain } from "electron";
import { Accounts } from "../api/account/accounts";
import { convertAccountToDisplayAccount, DisplayAccount } from "../api/account/display-account";
import { UserAccount } from "../api/account/user-account";
import { ActionedPost } from "../api/post/actioned-post";
import { convertStatusPostToDisplayPost, DisplayPost } from "../api/post/display-post";
import { StatusPost } from "../api/post/status-post";
import { SubmittedPost } from "../api/post/submitted-post";
import { phenDeckConfig } from "../config/phen-deck-config";
import { shouldFilterOutPost } from "../service/post-filter";
import WebContents = Electron.WebContents;
import IpcMainEvent = Electron.IpcMainEvent;

const accounts = Accounts.getInstance();
let mainWindow: BrowserWindow | null;

/**
 * Setup the communication channels between the front and back ends of the app.
 *
 * @param main Application window object.
 */
export const setupReactInterface = (main: BrowserWindow | null) => {
    mainWindow = main;

    ipcMain.on('getPosts', async (event) => {
        await getPosts(event.sender);
    })
    ipcMain.on('post', async (event, value: SubmittedPost) => {
        await post(event, value);
    });
    ipcMain.on('retweet', async (event, value: ActionedPost) => {
        await retweet(event, value);
    });
}

/**
 * Communication channel to send changes in configuration to the front end.
 */
export const sendUpdatedConfig = (senderArg?: WebContents) => {
    const sender = senderArg ?? mainWindow?.webContents;

    if (!sender) {
        console.error("Link to window not established.")
        return;
    }

    sender.send("updatedConfig", phenDeckConfig);
}

/**
 * Communication channel to send the account list to the front end.
 *
 * @param sender
 */
export const getAccounts = (sender: WebContents) => {
    const accounts = Accounts.getInstance().list();
    const displayAccounts = accounts
        .map((account: UserAccount) => convertAccountToDisplayAccount(account))
        .filter((displayAccount: DisplayAccount | null) => !!displayAccount);

    sender.send("getAccounts", displayAccounts);
}

/**
 * Communication channel to send a batch of posts to the front end.
 *
 * @param sender
 * @param oneTime
 */
export const getPosts = async (sender: WebContents, oneTime: boolean = false) => {
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
    console.log(`Filtered ${posts.length - filteredPosts.length} of ${posts.length} posts.`)

    // sort
    filteredPosts.sort((a: StatusPost, b: StatusPost) => a.getTimestamp().getTime() - b.getTimestamp().getTime());

    const conversionPromises: Promise<DisplayPost | null>[] = [];
    filteredPosts.forEach((post) => {
        conversionPromises.push(convertStatusPostToDisplayPost(post));
    })
    const displayPosts = await Promise.all(conversionPromises);
    sender.send("getPosts", displayPosts);

    if (!oneTime) {
        setTimeout(() => getPosts(sender), 30000)
    }
}

/**
 * Communication channel to send the post template list to the front end.
 *
 * @param sender
 */
export const getPostTemplates = (sender: WebContents) => {
    sender.send("getPostTemplates", phenDeckConfig.compose.postTemplates);
}


/**
 * Communication for the front end to send a submitted post to the back end.
 *
 * @param event
 * @param value
 */
export const post = async (event: IpcMainEvent, value: SubmittedPost) => {
    if (!value.text) {
        return;
    }

    const accountsLibrary = Accounts.getInstance();
    const accounts = value.accounts.map((account) => accountsLibrary.get(account));

    accounts.forEach((account => account?.post(value.text)));
}

/**
 * Communication for the front end to send a retweet to the back end.
 *
 * @param event
 * @param value
 */
export const retweet = async (event: IpcMainEvent, value: ActionedPost) => {
    const accountsLibrary = Accounts.getInstance();
    const accounts = value.accounts.map((account) => accountsLibrary.get(account));

    accounts.forEach((account => account?.retweet(value)));
}
