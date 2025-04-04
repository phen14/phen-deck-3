import mutesConfigUntyped from "../../../../config/mutes.json";
import { MutesConfig } from "../config/mutes-config-type";
import { phenDeckConfig } from "../config/phen-deck-config";

export const loadMutesConfig = async () => {
    const mutesConfigTyped = mutesConfigUntyped as MutesConfig;
    phenDeckConfig.timeline.hideRetweetsFromUsers = mutesConfigTyped.hideRetweetsFromUsers;
    phenDeckConfig.timeline.mutedPhrases = mutesConfigTyped.mutedPhrases;
};
