// (K) ALL RIGHTS REVERSED - Reprint what you like

import { LoremIpsum } from "lorem-ipsum";
import { v4 } from "uuid";

const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    }
});

/**
 * Class representation of the post templates in the configuration file and newly created ones in-app.
 */
export class PostTemplate {
    content: string;
    readonly deletable: boolean;
    readonly editable: boolean;
    id: string;

    constructor(content?: string, editable: boolean = true, deletable: boolean = true) {
        this.content = content ?? lorem.generateSentences(1);
        this.deletable = deletable;
        this.editable = editable;
        this.id = v4();
    }
}
