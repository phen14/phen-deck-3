// (K) ALL RIGHTS REVERSED - Reprint what you like

import { v4 } from "uuid";
import templatesConfigUntyped from "../../../../config/templates.json";
import { phenDeckConfig } from "../config/phen-deck-config";
import { PostTemplate } from "../config/post-template";

/**
 * Load templated users and phrases from the user's configuration file and store them in our global config object.
 */
export const loadPostTemplatesConfig = async () => {
    const templatesConfigTyped = templatesConfigUntyped as PostTemplate[];
    templatesConfigTyped.forEach((template) => {
        if (!template.id) {
            template.id = v4();
        }
    })

    phenDeckConfig.compose.postTemplates = templatesConfigTyped;
};
