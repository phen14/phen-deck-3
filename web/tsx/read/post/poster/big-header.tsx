// (K) ALL RIGHTS REVERSED - Reprint what you like

import dateFormat from "dateformat";
import { DisplayPost } from "../../../../../src/main/ts/api/post/display-post";
import Bluesky from "web/assets/bluesky.png";
import Egg from "web/assets/egg.png";
import Mastodon from "web/assets/mastodon.png";
import { DATE_FORMAT, TIME_FORMAT, YEAR_DATE_FORMAT } from "../../../util/constants";
import { Image } from "../../shared/image";

/**
 * Display a full header for a post, with the user's name, avatar, handle, and both full and relative timestamp.
 *
 * @param post Post being displayed.
 * @constructor
 */
export function BigHeader({ post } : { post: DisplayPost }): JSX.Element {

    const avatarSrc = post.posterAvatarUrl ?? Egg;
    const serviceSrc = post.posterService == "Bluesky" ? Bluesky : Mastodon;

    return (
        <div className="bigHeader">
            <div className="posterAvatarColumn">
                <Image className="posterAvatar" src={avatarSrc} />
            </div>
            <div className="posterDisplayName">
                <a href={ post.posterUrl } target="_blank" >{post.posterDisplayName}</a>
            </div>

            <div className="posterHandle">
                <img className="posterServiceIcon" src={serviceSrc} />
                {post.posterHandle}
            </div>

            <div className="postTimestamp">
                { dateFormat(post.timestamp, post.timestamp.getFullYear() == new Date().getFullYear() ? DATE_FORMAT : YEAR_DATE_FORMAT) }
                &nbsp;&nbsp;&nbsp;
                { dateFormat(post.timestamp, TIME_FORMAT) }
            </div>
            <div className="postTimeSince">
                <a href={ post.url } target="_blank">{ post.timeSince }</a>
            </div>
        </div>
    );
}
