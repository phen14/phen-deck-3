// (K) ALL RIGHTS REVERSED - Reprint what you like

import "../App.css";
import { useState } from "react";
import { DisplayPost } from "../../../src/main/ts/api/post/display-post";
import { Channels } from "../../../src/main/ts/app/preload";
import { phenDeckConfig, PhenDeckConfig } from "../../../src/main/ts/config/phen-deck-config";
import { List } from "../read/list/list";
import { getElectron } from "../util/get-electron";
import { CreatePost } from "../write/create-post";

export function MainWindow() {
    const [config, setConfig] = useState<PhenDeckConfig>(phenDeckConfig);

    getElectron().ipcRenderer.on("updatedConfig" as Channels, (arg) => {
        const config = arg as PhenDeckConfig;
        setConfig(config);

        if (!config.layout.updateTitleWithHomeCount) {
            document.title = config.title;
        }
    });

    const onHomeChange = (data: DisplayPost[]): void => {
        if (config.layout.updateTitleWithHomeCount && data.length) {
            document.title = `(${data.length}) ${config.title}`;
        } else {
            document.title = config.title;
        }
    }

    return (
        <div style={ { height: "100vh" } }>
            <div className="main-table">
                <CreatePost />
                <List config={ config } onChange={ onHomeChange } name="Combined Home" />
            </div>
        </div>
    );
}
