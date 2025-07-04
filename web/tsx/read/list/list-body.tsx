// (K) ALL RIGHTS REVERSED - Reprint what you like

import { JSX } from "react";
import { DisplayPost } from "../../../../src/main/ts/api/post/display-post";
import { PostElement } from "../post/post-element";

/**
 * Display a list of posts.
 *
 * @param posts Posts to display.
 * @constructor
 */
export function ListBody({ posts } : { posts: DisplayPost[] }): JSX.Element {
    const postElements: JSX.Element[] = posts ? posts.map((post) => <PostElement key={post.id} post={post} />) : [];

    return (
        <div className="listBody">
            { postElements }
        </div>
    );
}
