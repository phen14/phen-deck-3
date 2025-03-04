import { DisplayPost } from "../../../../src/main/ts/api/post/display-post";
import Reply from "web/assets/reply.png";

export function RepliedToRepliedToPost({ post } : { post: DisplayPost }): JSX.Element {
    if (!post.repliedToPosterDisplayName) {
        return (<span/>);
    }

    return (
        <table className="repliedToRepliedToPostTable">
            <tbody>
                <tr>
                    <td className="replyIconColumn">
                         <img src={Reply} />
                    </td>
                    <td className="repliedToRepliedToPoster">
                        <span>{post.repliedToPosterDisplayName}</span>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
