// (K) ALL RIGHTS REVERSED - Reprint what you like

import "./create-post.css";

import React, { JSX, useState } from "react";
import { PostTemplate } from "../../../src/main/ts/config/post-template";

type Params = {
    onChange: Function,
    onDelete: Function,
    onSelect: Function,
    onUse: Function,
    selected: boolean,
    template: PostTemplate
}

/**
 * A customizable template that can be selected.
 *
 * @param account Account details.
 * @param onSelect Function to run when an account is selected.
 * @constructor
 */
export function SelectableTemplate({ onChange, onDelete, onSelect, onUse, selected, template }: Params): JSX.Element {
    const [editing, setEditing] = useState<boolean>(false);

    const handleChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
        const target = event.target as HTMLTextAreaElement;
        if (onChange) {
            onChange(template, target.value);
        }
    };

    const makeMeDefault = (event: React.FormEvent) => {
        if (onSelect) {
            onSelect(template);
        }
        event.stopPropagation();
    };

    const deleteMe = (event: React.FormEvent) => {
        if (onDelete) {
            onDelete(template.id);
        }
        event.stopPropagation();
    };

    const editMe = (event: React.FormEvent) => {
        setEditing(!editing);
        event.stopPropagation();
    };

    const setPostToMe = (event: React.FormEvent) => {
        if (onUse) {
            onUse(template.content);
        }
        event.stopPropagation();
    };


    const className = "selectableTemplate " + (selected ? "selectedTemplate" : "unselectedTemplate");

    const contentDisplay = (template.content === "") ? (<span className="blankTemplate">[Blank Post]</span>) : template.content;
    const editLabel = editing ? "🔒 Done" : "✒ Edit";

    return (
        <div id={ template.id } className={ className } onClick={ setPostToMe }>
            <div className="templatePostBox">
                { (!template.editable || !editing) ? contentDisplay :
                    <textarea rows={ 4 } value={ template.content } onChange={ handleChange } /> }
            </div>
            <div className="templateActions">
                <div>
                    { selected ? " ✅ Default" : (<span onClick={ makeMeDefault }>Make Default</span>) }
                </div>
                <div>
                    { template.editable && <span onClick={ editMe }>{ editLabel }</span> }
                </div>
                <div>
                    { template.deletable && <span onClick={ deleteMe }>🗑 Delete</span> }
                </div>
            </div>
        </div>
    );
}
