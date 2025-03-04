import "./link.css";
import { DisplayPost } from "../../../../../src/main/ts/api/post/display-post";

export function LinkCard({ post } : { post: DisplayPost }): JSX.Element {
    if (!post.linkCard) {
        return (<span/>);
    }

    const imageSection = post.linkCard.imageUrl ? <img src={post.linkCard.imageUrl}/> : "";

    return (
        <div className="linkCard">
            <div className="linkTitle">{post.linkCard.title}</div>
            { imageSection }
            <div className="linkDescription">{post.linkCard.description}</div>
            <div className="linkUrl">{post.linkCard.url}</div>
        </div>
);
}
