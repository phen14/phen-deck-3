/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from "path";
import { app, BrowserWindow, shell, ipcMain, Menu } from "electron";
import { URL } from "url";
import { loadAccountConfig } from "./app/load-account-config";
import { loadMutesConfig } from "./app/load-mutes-config";
import { getAccounts, getPosts, setupReactInterface } from "./app/react-interface";
import { mainMenuTemplate } from "./menu/main-menu";

let mainWindow: BrowserWindow | null = null;

ipcMain.on("ipc-example", async (event, arg) => {
    const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
    console.log(msgTemplate(arg));
    event.reply("ipc-example", msgTemplate("pong"));
});

if (process.env.NODE_ENV === "production") {
    const sourceMapSupport = require("source-map-support");
    sourceMapSupport.install();
}

const isDebug = process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";

if (isDebug) {
    require("electron-debug")();
}

const installExtensions = async () => {
    const installer = require("electron-devtools-installer");
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ["REACT_DEVELOPER_TOOLS"];

    return installer
        .default(
            extensions.map((name) => installer[name]),
            forceDownload,
        )
        .catch(console.log);
};

const createWindow = async () => {
    if (isDebug) {
        await installExtensions();
    }

    const RESOURCES_PATH = app.isPackaged ? path.join(process.resourcesPath, "assets") : path.join(__dirname, "../../web/assets");

    const getAssetPath = (...paths: string[]): string => {
        return path.join(RESOURCES_PATH, ...paths);
    };

    mainWindow = new BrowserWindow({
        show: false,
        width: 753,
        height: 1024,
        icon: getAssetPath("icon.png"),
        title: "PhenDeck for Workspaces 3.11",
        webPreferences: {
            nodeIntegration: true,
            preload: app.isPackaged ? path.join(__dirname, "preload.js") : path.join(__dirname, "../../.erb/dll/preload.js"),
        },
    });

    mainWindow.loadURL(resolveHtmlPath("index.html"));

    mainWindow.on("ready-to-show", () => {
        if (!mainWindow) {
            throw new Error('"mainWindow" is not defined');
        }
        mainWindow.show();
    });

    mainWindow.on("closed", () => {
        mainWindow = null;
        app.quit();
    });

    // @ts-ignore I don't believe the type it says is required is correct.
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);

    // Open urls in the user's browser
    mainWindow.webContents.setWindowOpenHandler((edata) => {
        console.log('Hi.');
        shell.openExternal(edata.url);
        return { action: "deny" };
    });

    setTimeout(() => getAccounts(mainWindow!.webContents), 5000);
    setTimeout(() => getPosts(mainWindow!.webContents), 5000);
};

function resolveHtmlPath(htmlFileName: string) {
    if (process.env.NODE_ENV === "development") {
        const port = process.env.PORT || 1212;
        const url = new URL(`http://localhost:${port}`);
        url.pathname = htmlFileName;
        return url.href;
    }
    return `file://${path.resolve(__dirname, "../renderer/", htmlFileName)}`;
}

app.whenReady().then(async () => {
    await loadAccountConfig();
    await loadMutesConfig();
    setupReactInterface(mainWindow);
    await createWindow();
})
    .catch(console.log);
