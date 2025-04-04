// (K) ALL RIGHTS REVERSED - Reprint what you like

import "../App.css";
import { useState } from "react";
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
    });

    return (
        <div style={ { height: "100vh" } }>
            <div className="main-table">
                <CreatePost />
                <List config={ config } name="Combined Home" />
            </div>
        </div>
    );
}
