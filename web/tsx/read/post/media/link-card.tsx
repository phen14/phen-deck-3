// (K) ALL RIGHTS REVERSED - Reprint what you like

import "./link.css";
import { DisplayPost } from "../../../../../src/main/ts/api/post/display-post";

/**
 * Display a link with its title, preview image, description, and full URL.
 *
 * @param post Post containing the link.
 * @constructor
 */
export function LinkCard({ post } : { post: DisplayPost }): JSX.Element {
    if (!post.linkCard) {
        return (<span/>);
    }

    const imageSection = post.linkCard.imageUrl ? <img src={post.linkCard.imageUrl}/> : "";

    return (
        <div className="linkCard">
            <a href={post.linkCard.url} target="_blank">
            <div className="linkTitle">{post.linkCard.title}</div>
            { imageSection }
            </a>
            <div className="linkDescription">{post.linkCard.description}</div>
            <div className="linkUrl"><a href={post.linkCard.url} target="_blank">{ post.linkCard.url }</a></div>
        </div>
    );
}
