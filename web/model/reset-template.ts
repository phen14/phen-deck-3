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

export type ResetTemplateType = {
    content: string;
    fixed: boolean;
    id: string;
}

export class ResetTemplate implements ResetTemplateType {
    content: string;
    readonly fixed: boolean;
    id: string;

    constructor(content?: string, fixed?: boolean) {
        this.content = content ?? lorem.generateSentences(1);
        this.fixed = !!fixed;
        this.id = v4();
    }
}
