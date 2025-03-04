import { ElectronHandler } from "../../src/main/ts/app/preload";

declare global {
    // eslint-disable-next-line no-unused-vars
    interface Window {
        electron: ElectronHandler;
    }
}

export {};
