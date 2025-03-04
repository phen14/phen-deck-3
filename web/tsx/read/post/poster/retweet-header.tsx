import { DisplayPost } from "../../../../../src/main/ts/api/post/display-post";
import Retweet from "web/assets/retweet.png";
import { SmallHeader } from "./small-header";

export function RetweetHeader({ post } : { post: DisplayPost }): JSX.Element {
    return (
        <table className="retweetHeader" cellPadding="0" cellSpacing="0">
            <tbody>
                <tr>
                    <td className="retweetedIconColumn">
                        <img className="retweetedIcon" src={Retweet}/>
                    </td>
                    <td className="retweetSmallHeaderColumn">
                        <SmallHeader post={post} />
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
