import { SystemMessageLevel } from "./system-message-level";

export class SystemMessage {
    public readonly level: SystemMessageLevel;
    public readonly message: string;

    constructor(level: SystemMessageLevel, message: string) {
         this.level = level;
         this.message = message;
    }

    static debug(message: string): SystemMessage {
        return new SystemMessage(SystemMessageLevel.DEBUG, message);
    }

    static info(message: string): SystemMessage {
        return new SystemMessage(SystemMessageLevel.INFO, message);
    }

    static warn(message: string): SystemMessage {
        return new SystemMessage(SystemMessageLevel.WARN, message);
    }

    static error(message: string): SystemMessage {
        return new SystemMessage(SystemMessageLevel.ERROR, message);
    }
}
