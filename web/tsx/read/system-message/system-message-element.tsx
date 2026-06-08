// (K) ALL RIGHTS REVERSED - Reprint what you like

import "./system-message.css";
import React, { JSX } from "react";
import { SystemMessage } from "../../../../src/main/ts/api/system/system-message";
import { SystemMessageLevel } from "../../../../src/main/ts/api/system/system-message-level";

type Props = {
    message: SystemMessage
}

/**
 * Display a system message.
 *
 * @param message System message object.
 * @constructor
 */
export function SystemMessageElement({ message } : Props): JSX.Element {
    if (!message) {
        return <span />;
    }

    let className = "system-message";
    switch (message.level) {
        case SystemMessageLevel.DEBUG.valueOf():
            className += " debug";
            break;
        case SystemMessageLevel.INFO.valueOf():
            className += " info";
            break;
        case SystemMessageLevel.WARN.valueOf():
            className += " warn";
            break;
        case SystemMessageLevel.ERROR.valueOf():
            className += " error";
            break;
    }

    console.log("Message: ", message);
    let objects = "";
    if (message.objectJSONs) {
        objects = message.objectJSONs.join("<br/><br/>");
    }
    const objectSection = objects ? (
        <pre className="objectSection">
            { objects }
        </pre>
    ) : "";

    return (
        <div className={ className }>
            <div className="system">[System]</div>
            <div className="message">{ message.message }</div>
            { objectSection }
        </div>
    );
}
