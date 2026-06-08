import { DisplayPost } from "./display-post";

/**
 * All the information needed to retweet or favorite a post.
 */
export type ActionedPost = {
    accounts: string[],
    id: string;
    cid: string;
    url: string;
    retweet?: ActionedPost;
}

export const convertDisplayPostToActionedPost = (displayPost: DisplayPost): ActionedPost => {
    let retweet: ActionedPost | undefined = undefined;
    if (displayPost.retweet) {
        retweet = {
            accounts: [displayPost.viewer.accountId],
            id: displayPost.retweet.id,
            cid: displayPost.retweet.cid,
            url: displayPost.retweet.url
        };
    }

    return {
        accounts: [displayPost.viewer.accountId],
        id: displayPost.id,
        cid: displayPost.cid,
        url: displayPost.url,
        retweet
    } as ActionedPost;
}
