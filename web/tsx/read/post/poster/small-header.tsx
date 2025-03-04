import { DisplayPost } from "../../../../../src/main/ts/api/post/display-post";
import Bluesky from "web/assets/bluesky.png";
import Egg from "web/assets/egg.png";
import Mastodon from "web/assets/mastodon.png";
import { Image } from "../../shared/image";

export function SmallHeader({ post } : { post: DisplayPost }): JSX.Element {
    const avatarSrc = post.posterAvatarUrl ?? Egg;
    const serviceSrc = post.posterService == "Bluesky" ? Bluesky : Mastodon;

    return (
        <table className="smallHeader" cellPadding="0" cellSpacing="0">
            <tbody>
                <tr>
                    <td className="posterAvatarSmall" rowSpan={2}>
                        <Image className="posterAvatarSmall" src={avatarSrc}/>
                    </td>
                    <td className="posterDisplayName" colSpan={2}>
                        {post.posterDisplayName}
                    </td>
                </tr>
                <tr>
                    <td className="posterHandle" colSpan={2}>
                        <img className="posterServiceIcon" src={serviceSrc}/>
                        {post.posterHandle}
                    </td>
                    <td className="postTimeSince">
                        {post.timeSince}
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
