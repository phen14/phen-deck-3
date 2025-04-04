// (K) ALL RIGHTS REVERSED - Reprint what you like

import { LayoutConfig, layoutConfig } from "./layout-config";
import { TimelineConfig, timelineConfig } from "./timeline-config";

/**
 * Stored configuration for the app.
 */
export const phenDeckConfig: PhenDeckConfig = {
    layout: layoutConfig,
    timeline: timelineConfig
}

/**
 * Type defining the configuration for the app.
 */
export type PhenDeckConfig = {
    layout: LayoutConfig;
    timeline: TimelineConfig;
}
