export const timelineConfig: TimelineConfig = {
    ascendingOrder: true,
    hideNonMutualReplies: true,
    hideRetweetsFromUsers: [],
    mutedPhrases: []
}

export type TimelineConfig = {
    ascendingOrder: boolean;
    hideNonMutualReplies: boolean;
    hideRetweetsFromUsers: string[];
    mutedPhrases: string[];
}
