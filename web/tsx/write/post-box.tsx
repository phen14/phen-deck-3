// (K) ALL RIGHTS REVERSED - Reprint what you like

import "./create-post.css";

import React, { JSX, useState } from "react";
import { SubmittedPost } from "../../../src/main/ts/api/post/submitted-post";
import { Channels } from "../../../src/main/ts/app/preload";
import { getElectron } from "../util/get-electron";
import { TemplateSelection } from "./template-selection";

type Params = {
    max: number,
    onPost?: Function,
    onReset?: Function,
    selectedAccounts: string[]
}

/**
 * Display the box for text for a new post.
 *
 * @param max Maximum length for the post.
 * @param onPost Optional function to run when a post is made.
 * @param onReset Optional function to run when the Reset button is hit.
 * @param selectedAccounts List of currently selected accounts.
 * @constructor
 */
export function PostBox({ max, onPost, onReset, selectedAccounts }: Params): JSX.Element {
    const [count, setCount] = useState<number>(0);
    const [postContent, setPostContent] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState<string>("");

    const handleChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
        const target = event.target as HTMLTextAreaElement;
        setCount(target.value.length);
        setPostContent(target.value);
    };

    const handleReset = () => {
        setCount(selectedTemplate.length);
        setPostContent(selectedTemplate ?? "");

        if (onReset) {
            onReset();
        }
    };

    const post = () => {
        const submittedPost = {
            accounts: selectedAccounts,
            text: postContent
        } as SubmittedPost;
        getElectron().ipcRenderer.sendMessage("post" as Channels, submittedPost);
        handleReset();

        if (onPost) {
            onPost(post);
        }
    };

    const handleTemplateSelectionChange = (content: string) => {
        setSelectedTemplate(content);
    };

    const handleUseTemplate = (content: string) => {
        setCount(content.length);
        setPostContent(content ?? "");
    };

    const postDisabled = !selectedAccounts?.length;
    const resetDisabled = postContent === (selectedTemplate ?? "");

    let countClassName = "count";
    if (count > max) {
        countClassName += " overTheLimit";
    }

    return (
        <div>
            <div className="newPost">
                <div className="headerRow">
                    <h3>Post</h3>
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
            <TemplateSelection onSelect={ handleTemplateSelectionChange } onUse={ handleUseTemplate } />
        </div>
    );
}
