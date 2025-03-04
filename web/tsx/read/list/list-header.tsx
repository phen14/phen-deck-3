import { JSX, MouseEventHandler } from "react";

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
