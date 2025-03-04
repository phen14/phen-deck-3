import "./create-post.css";

import React, { JSX, useState } from "react";
import { SubmittedPost } from "../../../src/main/ts/api/post/submitted-post";
import { Channels } from "../../../src/main/ts/app/preload";
import { getElectron } from "../util/get-electron";

export function PostBox({ max, selectedAccounts }: { max: number, selectedAccounts: string[] }): JSX.Element {
    const [count, setCount] = useState<number>(0);
    const [postContent, setPostContent] = useState("");

    const handleChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
        const target = event.target as HTMLTextAreaElement;
        setCount(target.value.length);
        setPostContent(target.value);
    };

    const handleReset = () => {
        setCount(0);
        setPostContent("");
    };

    const post = () => {
        const submittedPost = {
            accounts: selectedAccounts,
            text: postContent
        } as SubmittedPost;
        getElectron().ipcRenderer.sendMessage("post" as Channels, submittedPost);
        handleReset();
    };

    const postDisabled = !selectedAccounts?.length;
    const resetDisabled = !postContent?.length;

    let countClassName = "count";
    if (count > max) {
        countClassName += " overTheLimit";
    }

    return (
        <table className="newPost">
            <tbody>
            <tr className="headerRow">
                <td className="postLabel">Post</td>
                <td className={ countClassName }>{ count }/{ max }</td>
            </tr>
            <tr>
                <td colSpan={ 2 }>
                    <div className="postBox">
                        <textarea rows={ 8 } value={ postContent } onChange={ handleChange } />
                    </div>
                </td>
            </tr>
            <tr className="headerRow">
                <td>
                    <button disabled={ resetDisabled } onClick={ handleReset }>Reset</button>
                </td>
                <td className="right">
                    <button disabled={ postDisabled } onClick={ post }>Post</button>
                </td>
            </tr>
            </tbody>
        </table>
    );
}
