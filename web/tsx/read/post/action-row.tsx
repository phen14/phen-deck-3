// (K) ALL RIGHTS REVERSED - Reprint what you like

import { JSX, MouseEventHandler } from "react";
import { DisplayPost } from "../../../../src/main/ts/api/post/display-post";
import Reply from "web/assets/reply.png";
import Retweet from "web/assets/retweet.png";

type Params = {
    post: DisplayPost,
    favoriteHandler: MouseEventHandler,
    rawHandler: MouseEventHandler,
    retweetHandler: MouseEventHandler
}

/**
 * Row of actions that can be taken on a post, if I ever get around to actually implementing them.
 *
 * @param post Post being displayed.
 * @param favoriteHandler Function to execute when the "favorite" button is hit.
 * @param rawHandler Function to execute when the "raw" button is hit.
 * @param retweetHandler Function to execute when the "retweet" button is hit.
 * @constructor
 */
export function ActionRow({ post, favoriteHandler, rawHandler, retweetHandler } : Params): JSX.Element {
    return (
        <div className="actionRow">
            <div className="actionColumn debugColumn" onClick={rawHandler}>🔍</div>
            <div className="actionColumn replyColumn"><img src={Reply} /></div>
            <div className="actionColumn retweetColumn" onClick={ retweetHandler }>
                <img src={Retweet}/>
            </div>
            <div className="actionColumn favoriteColumn" onClick={ favoriteHandler }>⭐</div>
            <div className="actionColumn menuColumn">🍔</div>
        </div>
    );
}
