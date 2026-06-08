import { DisplayItem } from "../display-item";
import { DisplayItemType } from "../display-item-type";
import { SystemMessageLevel } from "./system-message-level";

export class SystemMessage implements DisplayItem {
    public readonly id: string;
    public readonly level: SystemMessageLevel;
    public readonly message: string;
    public readonly objectJSONs: string[];
    public readonly timestamp: Date;
    public readonly type: DisplayItemType = DisplayItemType.SYSTEM_MESSAGE;

    constructor(level: SystemMessageLevel, message: string, ...objects: any[]) {
        this.id = crypto.randomUUID();
        this.level = level;
        this.message = message;
        this.objectJSONs = objects.map((object) => JSON.stringify(object, undefined, 2));
        this.timestamp = new Date(Date.now());
    }

    static debug(message: string, ...objects: any[]): SystemMessage {
        return new SystemMessage(SystemMessageLevel.DEBUG, message, ...objects);
    }

    static info(message: string, ...objects: any[]): SystemMessage {
        return new SystemMessage(SystemMessageLevel.INFO, message, ...objects);
    }

    static warn(message: string, ...objects: any[]): SystemMessage {
        return new SystemMessage(SystemMessageLevel.WARN, message, ...objects);
    }

    static error(message: string, ...objects: any[]): SystemMessage {
        let amendedMessage: string = message;
        if (objects && objects[0] instanceof Error) {
            amendedMessage = `${message}: ${objects[0].message}`;
        }
        return new SystemMessage(SystemMessageLevel.ERROR, amendedMessage, ...objects);
    }
}
