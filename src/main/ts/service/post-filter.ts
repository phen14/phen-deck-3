import { StatusPost } from "../api/post/status-post";
import { phenDeckConfig } from "../config/phen-deck-config";

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

function containsMutedPhrase(post: StatusPost, phrase: string | RegExp): boolean {
    if (!post) {
        return false;
    }

    if (post.getPostText().match(phrase)) {
        return true;
    }

    return !!(post.getLinkCard()?.title.match(phrase) || post.getLinkCard()?.description.match(phrase));
}

function isBlockedRetweet(post: StatusPost): boolean {
    if (!post.isRetweet()) {
        return false;
    }

    return phenDeckConfig.timeline.hideRetweetsFromUsers.includes(post.getPosterHandle());
}

export function shouldFilterOutPost(post: StatusPost) {
    return isBlockedRetweet(post) || containsMutedPhrases(post);
}
