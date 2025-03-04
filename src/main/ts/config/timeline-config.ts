export const timelineConfig: TimelineConfig = {
    ascendingOrder: true,
    hideNonMutualReplies: true,
    hideRetweetsFromUsers: ["helenqu.bsky.social"]
}

export type TimelineConfig = {
    ascendingOrder: boolean;
    hideNonMutualReplies: boolean;
    hideRetweetsFromUsers: string[];
}
