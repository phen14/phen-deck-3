import { SystemMessage } from "../api/system/system-message";
import { SystemMessageLevel } from "../api/system/system-message-level";
import { ReactInterface } from "../app/react-interface";
import { phenDeckConfig } from "../config/phen-deck-config";

/**
 * Back-end logging system to handle logging both to console and to the front-end.
 */
export class MessageSystem {
    private readonly reactInterface: ReactInterface;
    private readonly logLevel: SystemMessageLevel = SystemMessageLevel.INFO;

    /**
     * Create a new logger.
     *
     * @param className Name of the class (or anything else, really) that is using this logger.
     */
    constructor(private readonly className: string) {
        this.reactInterface = ReactInterface.getInstance();
    }

    /**
     * Record a debug-level message.
     *
     * @param messageText Text of the message.
     * @param objects Additional objects to include in the log.
     */
    debug(messageText: string, ...objects: any[]): void {
        const message: SystemMessage = SystemMessage.debug(messageText, ...objects);
        this.recordMessage(message, ...objects);
    }

    /**
     * Record an info-level message.
     *
     * @param messageText Text of the message.
     * @param objects Additional objects to include in the log.
     */
    info(messageText: string, ...objects: any[]): void {
        const message: SystemMessage = SystemMessage.info(messageText, ...objects);
        this.recordMessage(message, ...objects);
    }

    /**
     * Record a warn-level message.
     *
     * @param messageText Text of the message.
     * @param objects Additional objects to include in the log.
     */
    warn(messageText: string, ...objects: any[]): void {
        const message: SystemMessage = SystemMessage.warn(messageText, ...objects);
        this.recordMessage(message, ...objects);
    }

    /**
     * Record an error-level message.
     *
     * @param messageText Text of the message.
     * @param objects Additional objects to include in the log.
     */
    error(messageText: string, ...objects: any[]): void {
        const message: SystemMessage = SystemMessage.error(messageText, ...objects);
        this.recordMessage(message, ...objects);
    }

    /**
     * Write the message to the log and send it to the front end.
     *
     * @param message Message object containing level and text.
     * @param objects Additional objects to include in the log.
     * @private
     */
    private recordMessage(message: SystemMessage, ...objects: any[]): void {
        if (message.level >= this.logLevel) {
            console.log(message.message, ...objects);
        }

        if (message.level >= phenDeckConfig.timeline.systemMessageLevel) {
            void this.reactInterface.sendSystemMessage(message);
        }
    }
};
