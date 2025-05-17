// (K) ALL RIGHTS REVERSED - Reprint what you like

import { PostTemplate } from "./post-template";

/**
 * Stored configuration relating to composing new posts.
 */
export const composeConfig: ComposeConfig = {
    postTemplates: []
}

/**
 * Type defining the configuration relating to composing new posts.
 */
export type ComposeConfig = {
    postTemplates: PostTemplate[];
}
