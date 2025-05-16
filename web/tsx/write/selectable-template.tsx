// (K) ALL RIGHTS REVERSED - Reprint what you like

import "./create-post.css";

import React, { JSX, useState } from "react";
import { ResetTemplate } from "../../model/reset-template";

type Params = {
    onChange: Function,
    onDelete: Function,
    onSelect: Function,
    selected: boolean,
    template: ResetTemplate
}

/**
 * A customizable template that can be selected.
 *
 * @param account Account details.
 * @param onSelect Function to run when an account is selected.
 * @constructor
 */
export function SelectableTemplate({ onChange, onDelete, onSelect, selected, template }: Params): JSX.Element {
    const [editing, setEditing] = useState<boolean>(false);

    const handleChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
        const target = event.target as HTMLTextAreaElement;
        if (onChange) {
            onChange(template, target.value);
        }
    };

    const handleSelect = () => {
        if (onSelect) {
            onSelect(template);
        }
    };

    const deleteMe = () => {
        if (onDelete) {
            onDelete(template.id);
        }
    };

    const editMe = () => {
        setEditing(!editing);
    };

    const className = "selectableTemplate " + (selected ? "selectedTemplate" : "unselectedTemplate");

    let contentSection;
    if (template.fixed && template.content === "") {
        contentSection = (<div className="blankTemplate templatePostBox">[Blank Post]</div>);
    } else {
        contentSection = (
            <div className="templatePostBox">
                { template.fixed || !editing ? template.content :
                    <textarea rows={ 4 } value={ template.content } onChange={ handleChange } /> }
            </div>
        );
    }

    const editLabel = editing ? "🔒 Done" : "✒ Edit";

    return (
        <div id={ template.id } className={ className } onClick={ handleSelect }>
            <div className="checkX">{ selected ? "✅" : "❌" }</div>
            { contentSection }
            <div className="templateActions">
                { !template.fixed && <div onClick={ editMe }>{ editLabel }</div> }
                { !template.fixed && <div onClick={ deleteMe }>🗑 Remove</div> }
            </div>
            <hr />
        </div>
    );
}
