import { LayoutConfig, layoutConfig } from "./layout-config";
import { TimelineConfig, timelineConfig } from "./timeline-config";

export const phenDeckConfig: PhenDeckConfig = {
    layout: layoutConfig,
    timeline: timelineConfig
}

export type PhenDeckConfig = {
    layout: LayoutConfig;
    timeline: TimelineConfig;
}
