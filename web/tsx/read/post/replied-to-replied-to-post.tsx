// (K) ALL RIGHTS REVERSED - Reprint what you like

import { DisplayPost } from "../../../../src/main/ts/api/post/display-post";
import Reply from "web/assets/reply.png";

/**
 * Display the post that the post the main post replied to replied to.
 *
 * @param post The replied-to post that contains the replied-to replied-to post within it.
 * @constructor
 */
export function RepliedToRepliedToPost({ post } : { post: DisplayPost }): JSX.Element {
    if (!post.repliedToPosterDisplayName) {
        return (<span/>);
    }

    return (
        <div className="repliedToRepliedToPostTable">
            <div className="replyIconColumn">
                 <img src={Reply} />
            </div>
            <div className="repliedToRepliedToPoster">
                <span>{post.repliedToPosterDisplayName}</span>
            </div>
        </div>
    );
}
