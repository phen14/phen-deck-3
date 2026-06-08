// (K) ALL RIGHTS REVERSED - Reprint what you like

import { JSX } from "react";
import { DisplayItem } from "../../../../src/main/ts/api/display-item";
import { DisplayItemType } from "../../../../src/main/ts/api/display-item-type";
import { DisplayPost } from "../../../../src/main/ts/api/post/display-post";
import { SystemMessage } from "../../../../src/main/ts/api/system/system-message";
import { PostElement } from "../post/post-element";
import { SystemMessageElement } from "../system-message/system-message-element";

/**
 * Display a list of posts.
 *
 * @param items Posts to display.
 * @constructor
 */
export function ListBody({ items } : { items: DisplayItem[] }): JSX.Element {
    const postElements: JSX.Element[] = items ? items.map((item) => makeElement(item)) : [];

    return (
        <div className="listBody">
            { postElements }
        </div>
    );
}

function makeElement(item: DisplayItem): JSX.Element {
    switch (item.type) {
        case DisplayItemType.POST.valueOf():
            return makePost(item);
        case DisplayItemType.SYSTEM_MESSAGE.valueOf():
            return makeSystemMessage(item);
        default:
            return <span />;
    }
}

function makePost(item: DisplayItem) {
    const post = item as DisplayPost;
    return (<PostElement key={post.id} post={post} />);
}

function makeSystemMessage(item: DisplayItem) {
    const msg = item as SystemMessage;
    return (<SystemMessageElement key={msg.id} message={msg} />)
}
