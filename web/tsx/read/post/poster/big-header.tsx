import dateFormat from "dateformat";
import { DisplayPost } from "../../../../../src/main/ts/api/post/display-post";
import Bluesky from "web/assets/bluesky.png";
import Egg from "web/assets/egg.png";
import Mastodon from "web/assets/mastodon.png";
import { DATE_FORMAT, TIME_FORMAT, YEAR_DATE_FORMAT } from "../../../util/constants";
import { Image } from "../../shared/image";

export function BigHeader({ post } : { post: DisplayPost }): JSX.Element {

    const avatarSrc = post.posterAvatarUrl ?? Egg;
    const serviceSrc = post.posterService == "Bluesky" ? Bluesky : Mastodon;

    return (
        <table className="bigHeader" cellPadding="0" cellSpacing="0">
            <tbody>
                <tr>
                    <td className="posterAvatarColumn" rowSpan={3}>
                        <Image className="posterAvatar" src={avatarSrc}/>
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
                </tr>
                <tr>
                    <td className="postTimestamp">
                        { dateFormat(post.timestamp, post.timestamp.getFullYear() == new Date().getFullYear() ? DATE_FORMAT : YEAR_DATE_FORMAT) }
                        &nbsp;&nbsp;&nbsp;
                        { dateFormat(post.timestamp, TIME_FORMAT) }
                    </td>
                    <td className="postTimeSince">
                        { post.timeSince }
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
