import { MouseEventHandler } from "react";
import { DisplayPost } from "../../../../src/main/ts/api/post/display-post";
import Reply from "web/assets/reply.png";
import Retweet from "web/assets/retweet.png";

export function ActionRow({ post, rawHandler } : { post: DisplayPost, rawHandler: MouseEventHandler }): JSX.Element {
    return (
        <table className="actionRow">
            <tbody>
                <tr>
                    <td className="actionColumn" onClick={rawHandler}>🔍</td>
                    <td className="actionColumn"><img src={Reply} /></td>
                    <td className="actionColumn"><img src={Retweet}/></td>
                    <td className="actionColumn">⭐</td>
                    <td className="actionColumn">🍔</td>
                </tr>
            </tbody>
        </table>
    );
}
