import { DisplayPost } from "./display-post";

/**
 * All the information needed to retweet or favorite a post.
 */
export type ActionedPost = {
    accounts: string[],
    id: string;
    cid: string;
    url: string;
}

export const convertDisplayPostToActionedPost = (displayPost: DisplayPost): ActionedPost => {
    return {
        accounts: [displayPost.viewer.accountId],
        id: displayPost.id,
        cid: displayPost.cid,
        url: displayPost.url
    } as ActionedPost;
}
