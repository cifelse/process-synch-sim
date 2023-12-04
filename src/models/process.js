import { cli } from "../utils/cli.js";

/**
 * Proceed with the Process Syncrhonization Simulation
 * @async
 * @method
 * @param {Array<Object>} settings - Settings made by the user
 */
export const displayResults = (settings) => {
    // Display Settings
    cli.info(`Proceeding with the Simulation with the following Settings.`, { clear: true });

    cli.table(settings, { reduce: true });
}