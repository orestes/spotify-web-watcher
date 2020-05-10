import {getStoredValue, setIcon} from "./utils";
import {config} from "../config";

export class BackgroundHandler {
    async run() {
        const userId = (await getStoredValue(config.storageKey))[config.storageKey];
        const color = userId ? 'green' : 'red';
        await setIcon(`../../icons/48x48-${color}.png`);

        // TODO: Watch for changes on the stored key an change the icon accordingly
    }
}
