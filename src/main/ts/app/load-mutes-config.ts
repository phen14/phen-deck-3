// (K) ALL RIGHTS REVERSED - Reprint what you like

import mutesConfigUntyped from "../../../../config/mutes.json";
import { MutesConfig } from "../config/mutes-config-type";
import { phenDeckConfig } from "../config/phen-deck-config";

/**
 * Load muted users and phrases from the user's configuration file and store them in our global config object.
 */
export const loadMutesConfig = async () => {
    const mutesConfigTyped = mutesConfigUntyped as MutesConfig;
    phenDeckConfig.timeline.hideRetweetsFromUsers = mutesConfigTyped.hideRetweetsFromUsers;
    phenDeckConfig.timeline.mutedPhrases = mutesConfigTyped.mutedPhrases;
};
