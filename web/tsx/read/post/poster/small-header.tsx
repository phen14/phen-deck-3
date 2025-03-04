import { DisplayPost } from "../../../../../src/main/ts/api/post/display-post";
import Bluesky from "web/assets/bluesky.png";
import Egg from "web/assets/egg.png";
import Mastodon from "web/assets/mastodon.png";
import { Image } from "../../shared/image";

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
