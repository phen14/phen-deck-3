// (K) ALL RIGHTS REVERSED - Reprint what you like

import { DisplayPost } from "../../../../../src/main/ts/api/post/display-post";
import Bluesky from "web/assets/bluesky.png";
import Egg from "web/assets/egg.png";
import Mastodon from "web/assets/mastodon.png";
import { Image } from "../../shared/image";

/**
 * Display a small header for a post, with the user's name, avatar, handle, and relative timestamp.
 *
 * @param post Post being displayed.
 * @constructor
 */
export function SmallHeader({ isRetweet, post } : { isRetweet: boolean, post: DisplayPost }): JSX.Element {
    const avatarSrc = post.posterAvatarUrl ?? Egg;
    const serviceSrc = post.posterService == "Bluesky" ? Bluesky : Mastodon;

    let timeSince: string | JSX.Element = post.timeSince;
    if (!isRetweet) {
        timeSince = (
            <a href={ post.url } target="_blank">{ post.timeSince }</a>
        )
    }

    return (
        <div className="smallHeader">
            <div className="posterAvatarSmall">
                <Image src={avatarSrc}/>
            </div>
            <div className="posterDisplayName">
                <a href={ post.posterUrl } target="_blank" >{post.posterDisplayName}</a>
            </div>
            <div className="posterHandle">
                <img className="posterServiceIcon" src={serviceSrc}/>
                {post.posterHandle}
            </div>
            <div className="postTimeSince">
                { timeSince }
            </div>
        </div>
    );
}
