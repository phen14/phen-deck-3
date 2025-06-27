// (K) ALL RIGHTS REVERSED - Reprint what you like

import { MouseEventHandler } from "react";
import { DisplayPost } from "../../../../src/main/ts/api/post/display-post";
import Reply from "web/assets/reply.png";
import Retweet from "web/assets/retweet.png";

type Params = {
    post: DisplayPost,
    rawHandler: MouseEventHandler,
    retweetHandler: MouseEventHandler
}

/**
 * Row of actions that can be taken on a post, if I ever get around to actually implementing them.
 *
 * @param post Post being displayed.
 * @param rawHandler Function to execute when the "raw" button is hit.
 * @constructor
 */
export function ActionRow({ post, rawHandler, retweetHandler } : Params): JSX.Element {
    return (
        <div className="actionRow">
            <div className="actionColumn debugColumn" onClick={rawHandler}>🔍</div>
            <div className="actionColumn replyColumn"><img src={Reply} /></div>
            <div className="actionColumn retweetColumn" onClick={ retweetHandler }>
                <img src={Retweet}/>
            </div>
            <div className="actionColumn favoriteColumn">⭐</div>
            <div className="actionColumn menuColumn">🍔</div>
        </div>
    );
}
