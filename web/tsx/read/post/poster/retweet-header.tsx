// (K) ALL RIGHTS REVERSED - Reprint what you like

import { JSX } from "react";
import { DisplayPost } from "../../../../../src/main/ts/api/post/display-post";
import Retweet from "web/assets/retweet.png";
import { SmallHeader } from "./small-header";

/**
 * Display a small header for a retweet, with the retweet image and the user's name, avatar, handle, and relative timestamp.
 *
 * @param post Post being displayed.
 * @constructor
 */
export function RetweetHeader({ post } : { post: DisplayPost }): JSX.Element {
    const className = `retweetHeader ${post.isRetweetedByMe ? "me" : "notMe"}`;

    return (
        <div className={className}>
            <div className="retweetedIconColumn">
                <img className="retweetedIcon" src={Retweet} />
            </div>
            <div className="retweetSmallHeaderColumn">
                <SmallHeader isRetweet={true} post={post} />
            </div>
        </div>
    );
}
