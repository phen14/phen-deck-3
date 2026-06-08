// (K) ALL RIGHTS REVERSED - Reprint what you like

import { Accounts } from "../api/account/accounts";
import { SystemMessageLevel } from "../api/system/system-message-level";
import { ReactInterface } from "../app/react-interface";
import { phenDeckConfig } from "../config/phen-deck-config";
import { refreshConfig } from "../main";

/**
 * The menus and menu items displayed in the menu bar at the top of the window.
 */
export const mainMenuTemplate = [
    // { role: 'fileMenu' }
    {
        label: 'File',
        submenu: [
            {
                label: 'Refresh Config',
                click: () => { refreshConfig() }
            },
            { role: 'quit' }
        ]
    },
    // { role: 'viewMenu' }
    {
        label: 'View',
        submenu: [
            { role: 'toggleDevTools' },
        ]
    },
    // { role: 'adminMenu' }
    {
        label: 'Admin',
        submenu: [
            {
                label: 'Force Load',
                click: () => {
                    console.log("Force loading.");
                    ReactInterface.getInstance().getPosts(undefined, true);
                }
            },
            {
                label: 'Reset Cursors',
                click: () => {
                    console.log("Resetting Cursors.");
                    Accounts.getInstance().resetCursors();
                    ReactInterface.getInstance().getPosts(undefined, true);
                }
            },
            {
                label: 'Forget Known Posts',
                click: () => {
                    console.log("Clearing known posts.");
                    Accounts.getInstance().forgetPosts();
                }
            },
        ]
    },
    // { role: 'timelineMenu' }
    {
        label: 'Timeline',
        submenu: [
            {
                checked: true,
                label: 'Show in Ascending Order',
                type: 'checkbox',
                click: () => {
                    phenDeckConfig.timeline.ascendingOrder = !phenDeckConfig.timeline.ascendingOrder;
                    ReactInterface.getInstance().sendUpdatedConfig();
                }

            },
            {
                checked: true,
                label: 'Hide Non-Mutual Replies',
                type: 'checkbox',
                click: () => {
                    phenDeckConfig.timeline.hideNonMutualReplies = !phenDeckConfig.timeline.hideNonMutualReplies;
                    ReactInterface.getInstance().sendUpdatedConfig();
                }
            },
            {
                checked: true,
                label: 'Update Title with Home Count',
                type: 'checkbox',
                click: () => {
                    phenDeckConfig.layout.updateTitleWithHomeCount = !phenDeckConfig.layout.updateTitleWithHomeCount;
                    ReactInterface.getInstance().sendUpdatedConfig();
                }
            },
            {
                label: 'System Message Level',
                submenu: [
                    {
                        checked: phenDeckConfig.timeline.systemMessageLevel === SystemMessageLevel.DEBUG,
                        label: 'Debug',
                        type: 'radio',
                        click: () => {
                            phenDeckConfig.timeline.systemMessageLevel = SystemMessageLevel.DEBUG;
                            ReactInterface.getInstance().sendUpdatedConfig();
                        }
                    },
                    {
                        checked: phenDeckConfig.timeline.systemMessageLevel === SystemMessageLevel.INFO,
                        label: 'Info',
                        type: 'radio',
                        click: () => {
                            phenDeckConfig.timeline.systemMessageLevel = SystemMessageLevel.INFO;
                            ReactInterface.getInstance().sendUpdatedConfig();
                        }
                    },
                    {
                        checked: phenDeckConfig.timeline.systemMessageLevel === SystemMessageLevel.WARN,
                        label: 'Warn',
                        type: 'radio',
                        click: () => {
                            phenDeckConfig.timeline.systemMessageLevel = SystemMessageLevel.WARN;
                            ReactInterface.getInstance().sendUpdatedConfig();
                        }
                    },
                    {
                        checked: phenDeckConfig.timeline.systemMessageLevel === SystemMessageLevel.ERROR,
                        label: 'Error',
                        type: 'radio',
                        click: () => {
                            phenDeckConfig.timeline.systemMessageLevel = SystemMessageLevel.ERROR;
                            ReactInterface.getInstance().sendUpdatedConfig();
                        }
                    },
                ]
            },
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click: async () => {
                    const { shell } = require('electron')
                    await shell.openExternal('https://electronjs.org')
                }
            }
        ]
    }
];
