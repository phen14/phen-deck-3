// (K) ALL RIGHTS REVERSED - Reprint what you like

import { sendUpdatedConfig } from "../app/react-interface";
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
    // { role: 'timelineMenu' }
    {
        label: 'Timeline',
        submenu: [
            { label: 'Force Load' },
            { label: 'Reset Cursors' },
            { type: 'separator' },
            {
                checked: true,
                label: 'Show in Ascending Order',
                type: 'checkbox',
                click: () => {
                    phenDeckConfig.timeline.ascendingOrder = !phenDeckConfig.timeline.ascendingOrder;
                    sendUpdatedConfig();
                }

            },
            {
                checked: true,
                label: 'Hide Non-Mutual Replies',
                type: 'checkbox',
                click: () => {
                    phenDeckConfig.timeline.hideNonMutualReplies = !phenDeckConfig.timeline.hideNonMutualReplies;
                    sendUpdatedConfig();
                }
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
