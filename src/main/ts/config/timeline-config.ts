// (K) ALL RIGHTS REVERSED - Reprint what you like

import { SystemMessageLevel } from "../api/system/system-message-level";

/**
 * Stored configuration relating to the display of posts in timelines.
 */
export const timelineConfig: TimelineConfig = {
    ascendingOrder: true,
    hideNonMutualReplies: true,
    hideRetweetsFromUsers: [],
    mutedPhrases: [],
    systemMessageLevel: SystemMessageLevel.INFO
}

/**
 * Type defining the configuration relating to the display of posts in timelines.
 */
export type TimelineConfig = {
    ascendingOrder: boolean;
    hideNonMutualReplies: boolean;
    hideRetweetsFromUsers: string[];
    mutedPhrases: string[];
    systemMessageLevel: SystemMessageLevel;
}
