import { MouseEventHandler } from "react";
import { DisplayPost } from "../../../../src/main/ts/api/post/display-post";
import Reply from "web/assets/reply.png";
import Retweet from "web/assets/retweet.png";

export function ActionRow({ post, rawHandler } : { post: DisplayPost, rawHandler: MouseEventHandler }): JSX.Element {
    return (
        <div className="actionRow">
            <div className="actionColumn" onClick={rawHandler}>🔍</div>
            <div className="actionColumn"><img src={Reply} /></div>
            <div className="actionColumn"><img src={Retweet}/></div>
            <div className="actionColumn">⭐</div>
            <div className="actionColumn">🍔</div>
        </div>
    );
}
