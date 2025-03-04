import { DisplayPost } from "../../../../../src/main/ts/api/post/display-post";
import Retweet from "web/assets/retweet.png";
import { SmallHeader } from "./small-header";

export function RetweetHeader({ post } : { post: DisplayPost }): JSX.Element {
    return (
        <div className="retweetHeader">
            <div className="retweetedIconColumn">
                <img className="retweetedIcon" src={Retweet} />
            </div>
            <div className="retweetSmallHeaderColumn">
                <SmallHeader post={post} />
            </div>
        </div>
    );
}
