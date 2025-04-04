// (K) ALL RIGHTS REVERSED - Reprint what you like

import { JSX, MouseEventHandler } from "react";

/**
 * Display the list header.
 *
 * @param clear Function to run when the "clear" button is hit.
 * @param count Number of posts in the list.
 * @param name Name of the list.
 * @constructor
 */
export function ListHeader({ clear, count, name } : { clear: MouseEventHandler, count: number, name: string }): JSX.Element {
    return (
        <div className="listHeader">
            <div className="listHeaderNameAndPostCount">
                <div className="listName">{ name }</div>
                <div className="postCount">{count} Post{ count == 1 ? "" : "s" }</div>
            </div>
            <div className="listControls">
                <span onClick={clear}>🗑</span>
            </div>
        </div>
    );
}
