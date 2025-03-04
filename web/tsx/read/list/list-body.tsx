import { JSX } from "react";
import { DisplayPost } from "../../../../src/main/ts/api/post/display-post";
import { PostElement } from "../post/post-element";

export function ListBody({ posts } : { posts: DisplayPost[] }): JSX.Element {

    const postElements: JSX.Element[] = posts ? posts.map((post) => <PostElement key={post.id} post={post} />) : [];

    return (
        <div className="listBody">
            { postElements }
        </div>
    );
}
