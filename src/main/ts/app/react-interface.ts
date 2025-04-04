import { BrowserWindow, ipcMain } from "electron";
import { Accounts } from "../api/account/accounts";
import { convertAccountToDisplayAccount, DisplayAccount } from "../api/account/display-account";
import { UserAccount } from "../api/account/user-account";
import { convertStatusPostToDisplayPost, DisplayPost } from "../api/post/display-post";
import { StatusPost } from "../api/post/status-post";
import { SubmittedPost } from "../api/post/submitted-post";
import { phenDeckConfig } from "../config/phen-deck-config";
import { shouldFilterOutPost } from "../service/post-filter";
import WebContents = Electron.WebContents;
import IpcMainEvent = Electron.IpcMainEvent;

const accounts = Accounts.getInstance();
let mainWindow: BrowserWindow | null;

export const setupReactInterface = (main: BrowserWindow | null) => {
    mainWindow = main;

    ipcMain.on('getPosts', async (event) => {
        await getPosts(event.sender);
    })
    ipcMain.on('post', async (event, value: SubmittedPost) => {
        await post(event, value);
    });
}

export const sendUpdatedConfig = () => {
    if (!mainWindow) {
        console.error("Link to window not established.")
        return;
    }

    mainWindow.webContents.send("updatedConfig", phenDeckConfig);
}

export const getAccounts = (sender: WebContents) => {
    console.log("in getAccounts()");
    const accounts = Accounts.getInstance().list();
    const displayAccounts = accounts
        .map((account: UserAccount) => convertAccountToDisplayAccount(account))
        .filter((displayAccount: DisplayAccount | null) => !!displayAccount);

    sender.send("getAccounts", displayAccounts);
}

export const getPosts = async (sender: WebContents, oneTime: boolean = false) => {
    console.log("in getPosts()");
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

export const post = async (event: IpcMainEvent, value: SubmittedPost) => {
    console.log("in posts()");

    const accountsLibrary = Accounts.getInstance();
    const accounts = value.accounts.map((account) => accountsLibrary.get(account));

    accounts.forEach((account => account?.post(value.text)));
}
