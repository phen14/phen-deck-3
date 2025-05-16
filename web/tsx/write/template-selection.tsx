// (K) ALL RIGHTS REVERSED - Reprint what you like

import "./create-post.css";

import { JSX, useState } from "react";
import { ResetTemplate } from "../../model/reset-template";

import { SelectableTemplate } from "./selectable-template";


// Map wrapper because React doesn't like having them in state.
type MapWrapper = {
    items: Map<string, ResetTemplate>;
}

// Default blank template to which to reset.
const BLANK_RESET_TEMPLATE = new ResetTemplate("", true);

/**
 * A list of templates to which the post box can be reset.
 *
 * @param onSelect Function to run when a template is selected.
 * @constructor
 */
export function TemplateSelection({ onSelect }: { onSelect: Function }): JSX.Element {
    const [data, setData] = useState<MapWrapper>({ items: new Map([[BLANK_RESET_TEMPLATE.id, BLANK_RESET_TEMPLATE]]) });
    const [selected, setSelected] = useState<string>(BLANK_RESET_TEMPLATE.id);

    const handleChange = (id: string, content: string) => {
        console.log(`handleChange(${id})`);

        if (id === selected) {
            if (onSelect) {
                onSelect(id, content);
            }
        }
    };

    const addTemplate = () => {
        console.log("Adding.");
        const added = new ResetTemplate();
        data.items.set(added.id, added);
        setData({ items: data.items });
    }

    const removeTemplate = (id: string) => {
        console.log("Remove", id);
        data.items.delete(id);
        setData({ items: data.items });
    }

    const handleTemplateChange = (id: string, content: string) => {
        const altered = data.items.get(id);
        if (altered) {
            altered.content = content;
            setData({ items: data.items });
        }
    }

    const handleSelect = (template: ResetTemplate) => {
        console.log(`HandleSelect(${template})`);
        setSelected(template.id);

        if (onSelect) {
            onSelect(template.content);
        }
    };

    const rows = [...data.items.values()].map((template) => (
        <SelectableTemplate
            key={ template.id }
            onChange={ handleTemplateChange }
            onDelete={ removeTemplate }
            onSelect={ handleSelect }
            selected={ template.id === selected }
            template={ template }
        />
    ));

    return (
        <div className="selectTemplateWrapper">
            <div className="selectAccountsLabel">Reset Templates</div>
            { rows }
            <div className="addButton" onClick={ addTemplate }>➕ Add</div>
        </div>
    );
}
