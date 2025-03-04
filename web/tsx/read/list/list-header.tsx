import { JSX, MouseEventHandler } from "react";

export function ListHeader({ clear, count, name } : { clear: MouseEventHandler, count: number, name: string }): JSX.Element {
    return (
        <table className="listHeader">
            <tbody>
                <tr>
                    <td>
                        <span className="listName">{ name }</span>
                        <span className="postCount">{count} Post{ count == 1 ? "" : "s" }</span>
                    </td>
                    <td className="listControls">
                        <span onClick={clear}>🗑</span>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
