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
export function SmallHeader({ post } : { post: DisplayPost }): JSX.Element {
    const avatarSrc = post.posterAvatarUrl ?? Egg;
    const serviceSrc = post.posterService == "Bluesky" ? Bluesky : Mastodon;

    return (
        <div className="smallHeader">
            <div className="posterAvatarSmall">
                <Image src={avatarSrc}/>
            </div>
            <div className="posterDisplayName">
                {post.posterDisplayName}
            </div>
            <div className="posterHandle">
                <img className="posterServiceIcon" src={serviceSrc}/>
                {post.posterHandle}
            </div>
            <div className="postTimeSince">
                {post.timeSince}
            </div>
        </div>
    );
}
