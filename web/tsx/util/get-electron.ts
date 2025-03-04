import { ElectronHandler } from "../../../src/main/ts/app/preload";

/**
 * IntelliJ doesn't recognize window.electron is being set by the preloader.
 * This is so there's only a red blob in one place.
 */
export function getElectron(): ElectronHandler {
    return window.electron;
}
