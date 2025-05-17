// (K) ALL RIGHTS REVERSED - Reprint what you like

import "./create-post.css";

import { JSX, useState } from "react";
import { Channels } from "../../../src/main/ts/app/preload";
import { PhenDeckConfig } from "../../../src/main/ts/config/phen-deck-config";
import { PostTemplate } from "../../../src/main/ts/config/post-template";
import { getElectron } from "../util/get-electron";

import { SelectableTemplate } from "./selectable-template";


// Map wrapper because React doesn't like having them in state.
type MapWrapper = {
    items: Map<string, PostTemplate>;
}

// Default blank template to which to reset.
const BLANK_RESET_TEMPLATE = new PostTemplate("", false, false);
BLANK_RESET_TEMPLATE.id = "0"; // The template resets in dev mode when I make changes and thus changes the ID.

/**
 * A list of templates to which the post box can be reset.
 *
 * @param onSelect Function to run when a template is selected.
 * @param onSelect Function to run when a template is used.
 * @constructor
 */
export function TemplateSelection({ onSelect, onUse }: { onSelect: Function, onUse: Function }): JSX.Element {
    const [data, setData] = useState<MapWrapper>({
        items: new Map([[BLANK_RESET_TEMPLATE.id, BLANK_RESET_TEMPLATE]])
    });
    const [selected, setSelected] = useState<string>(BLANK_RESET_TEMPLATE.id);

    getElectron().ipcRenderer.on("updatedConfig" as Channels, (arg) => {
        console.log("In updatedConfig (TemplateSelection).");
        const config = arg as PhenDeckConfig;
        config.compose.postTemplates.forEach((template: PostTemplate) => {
            data.items.set(template.id, template);
        });
        setData(data);
    });


    const handleChange = (id: string, content: string) => {
        console.log(`handleChange(${ id })`);

        if (id === selected) {
            if (onSelect) {
                onSelect(id, content);
            }
        }
    };

    const addTemplate = () => {
        console.log("Adding.");
        const added = new PostTemplate();
        data.items.set(added.id, added);
        setData({ items: data.items });
    };

    const removeTemplate = (id: string) => {
        console.log("Remove", id);
        data.items.delete(id);
        setData({ items: data.items });

        if (selected === id) {
            handleSelect(BLANK_RESET_TEMPLATE);
        }
    };

    const handleTemplateChange = (id: string, content: string) => {
        const altered = data.items.get(id);
        if (altered) {
            altered.content = content;
            setData({ items: data.items });
        }
    };

    const handleSelect = (template: PostTemplate) => {
        console.log(`HandleSelect(${ template.id }, ${ template.content })`);
        setSelected(template.id);

        if (onSelect) {
            onSelect(template.content);
        }
    };

    const handleUse = (content: string) => {
        if (onUse) {
            onUse(content);
        }
    };

    const rows = [...data.items.values()].map((template) => (
        <SelectableTemplate
            key={ template.id }
            onChange={ handleTemplateChange }
            onDelete={ removeTemplate }
            onSelect={ handleSelect }
            onUse={ handleUse }
            selected={ template.id === selected }
            template={ template }
        />
    ));

    return (
        <div className="selectTemplateWrapper">
            <div className="selectAccountsLabel">Post Templates</div>
            { rows }
            <div className="addButton" onClick={ addTemplate }>➕ Add</div>
        </div>
    );
}
