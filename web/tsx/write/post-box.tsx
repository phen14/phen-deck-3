// (K) ALL RIGHTS REVERSED - Reprint what you like

import "./create-post.css";

import React, { JSX, useState } from "react";
import { SubmittedPost } from "../../../src/main/ts/api/post/submitted-post";
import { Channels } from "../../../src/main/ts/app/preload";
import { getElectron } from "../util/get-electron";

/**
 * Display the box for text for a new post.
 *
 * @param max Maximum length for the post.
 * @param selectedAccounts List of currently selected accounts.
 * @constructor
 */
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
        <div className="newPost">
            <div className="headerRow">
                <div className="postLabel">Post</div>
                <div className={ countClassName }>{ count }/{ max }</div>
            </div>
            <div>
                <div>
                    <div className="postBox">
                        <textarea rows={ 8 } value={ postContent } onChange={ handleChange } />
                    </div>
                </div>
            </div>
            <div className="createPostActions">
                <div className="resetButton">
                    <button disabled={ resetDisabled } onClick={ handleReset }>Reset</button>
                </div>
                <div className="postButton">
                    <button disabled={ postDisabled } onClick={ post }>Post</button>
                </div>
            </div>
        </div>
    );
}
