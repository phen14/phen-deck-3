import { DisplayItemType } from "./display-item-type";

export interface DisplayItem {
    id: string;
    timestamp: Date;
    type: DisplayItemType;
}
