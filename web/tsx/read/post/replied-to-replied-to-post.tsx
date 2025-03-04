import { DisplayPost } from "../../../../src/main/ts/api/post/display-post";
import Reply from "web/assets/reply.png";

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
