// (K) ALL RIGHTS REVERSED - Reprint what you like

/**
 * Stored configuration relating to the display of posts in timelines.
 */
export const timelineConfig: TimelineConfig = {
    ascendingOrder: true,
    hideNonMutualReplies: true,
    hideRetweetsFromUsers: [],
    mutedPhrases: []
}

/**
 * Type defining the configuration relating to the display of posts in timelines.
 */
export type TimelineConfig = {
    ascendingOrder: boolean;
    hideNonMutualReplies: boolean;
    hideRetweetsFromUsers: string[];
    mutedPhrases: string[];
}
