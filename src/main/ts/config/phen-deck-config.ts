// (K) ALL RIGHTS REVERSED - Reprint what you like

import { ComposeConfig, composeConfig } from "./compose-config";
import { LayoutConfig, layoutConfig } from "./layout-config";
import { TimelineConfig, timelineConfig } from "./timeline-config";

/**
 * Stored configuration for the app.
 */
export const phenDeckConfig: PhenDeckConfig = {
    compose: composeConfig,
    layout: layoutConfig,
    timeline: timelineConfig,
    title: "phenDeck for Workspaces 3.11",
}

/**
 * Type defining the configuration for the app.
 */
export type PhenDeckConfig = {
    compose: ComposeConfig;
    layout: LayoutConfig;
    timeline: TimelineConfig;
    title: string;
}
