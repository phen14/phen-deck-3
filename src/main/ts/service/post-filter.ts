// (K) ALL RIGHTS REVERSED - Reprint what you like

import { StatusPost } from "../api/post/status-post";
import { phenDeckConfig } from "../config/phen-deck-config";

/**
 * Check if a post or posts that would be displayed along with it contain a muted phrase.
 *
 * @param post
 */
function containsMutedPhrases(post: StatusPost): boolean {
    for (const phrase of phenDeckConfig.timeline.mutedPhrases) {
        const regex = new RegExp(String.raw `(^|\W+)${phrase}(?=\W+|$)`);
        if (containsMutedPhrase(post, regex)) {
            return true;
        }

        if (post.isRetweet() && containsMutedPhrase(post.getRetweet()!, regex)) {
            return true;
        }

        if (post.isQuoteTweet() && containsMutedPhrase(post.getQuoteTweet()!, regex)) {
            return true;
        }

        if (post.isReply() && containsMutedPhrase(post.getRepliedTo()!, regex)) {
            return true;
        }
    }
    return false;
}

/**
 * Check if a post or any of its parts contains a specific phrase.
 *
 * @param post
 * @param phrase
 */
function containsMutedPhrase(post: StatusPost, phrase: string | RegExp): boolean {
    if (!post) {
        return false;
    }

    if (post.getPostText().match(phrase)) {
        return true;
    }

    return !!(post.getLinkCard()?.title.match(phrase) || post.getLinkCard()?.description.match(phrase));
}

/**
 * Check if a retweeted post is from a user whose retweets we don't want to see.
 *
 * @param post
 */
function isBlockedRetweet(post: StatusPost): boolean {
    if (!post.isRetweet()) {
        return false;
    }

    return phenDeckConfig.timeline.hideRetweetsFromUsers.includes(post.getPosterHandle());
}

/**
 * Check if we should block a post that the service returned in a timeline should be hidden.
 *
 * @param post
 */
export function shouldFilterOutPost(post: StatusPost) {
    return isBlockedRetweet(post) || containsMutedPhrases(post);
}
