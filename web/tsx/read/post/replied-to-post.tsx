// (K) ALL RIGHTS REVERSED - Reprint what you like

import { DisplayPost } from "../../../../src/main/ts/api/post/display-post";
import Reply from "web/assets/reply.png";
import { PostElement } from "./post-element";

/**
 * Display the post that the main post replied to.
 *
 * @param post The main post that contains the replied-to post within it.
 * @constructor
 */
export function RepliedToPost({ post } : { post: DisplayPost }): JSX.Element {
    if (!post.repliedTo) {
        return (<span/>);
    }

    return (
        <div className="repliedToPostTable">
            <div className="replyIconColumn">
                 <img src={Reply} />
            </div>
            <PostElement isRepliedTo={true} post={post.repliedTo} />
        </div>
    );
}
