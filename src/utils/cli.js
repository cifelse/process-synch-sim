import { stdin as input, stdout as output } from "node:process";
import * as readline from "node:readline/promises";
import chalk from "chalk";
import { Transform } from "node:stream";
import { Console } from "node:console";

/**
 * @module utils/cli
 */
export const cli = {
    /**
     * Prints a success message to the console
     * @method
     * @param {String} message - The message to print
     * @param {Object} options - Options in printing the info
     */
    info: (message, options) => {
        if (options) {
            const { color, clear } = options;
            if (clear) console.clear();
            console.log(chalk[color ?? 'cyanBright'](message));
        }
        else
            console.log(chalk.cyanBright(message));
    },

    /**
     * Prints an error message to the console
     * @method
     * @param {String} message - The message to print
     * @param {Bool} clear - Clear the console before printing the message
     * @returns {Number} - Returns -1, a value that can be used to exit the loops
     */
    error: (message, clear) => {
        if (clear) console.clear();
        console.error(chalk.red(message));
        return -1;
    },

    /**
     * Prints a table to the console
     * @method
     * @param {String} data - The data to print
     * @param {Bool} options - Options in printing the table
     */
    table: (data, options) => {
        const { clear, reduce } = options;

        if (clear) console.clear();

        if (reduce) {
            const ts = new Transform({ transform(chunk, _, cb) { cb(null, chunk) } });
            const logger = new Console({ stdout: ts }).table(data);

            const table = (ts.read() || '').toString();

            let result = '';
            for (let row of table.split(/[\r\n]+/)) {
                let r = row.replace(/[^┬]*┬/, '┌');
                r = r.replace(/^├─*┼/, '├');
                r = r.replace(/│[^│]*/, '');
                r = r.replace(/^└─*┴/, '└');
                r = r.replace(/'/g, ' ');
                result += `${r}\n`;
            }

            return console.log(result);
        }

        console.table(data);
    },

    /**
     * Asks an input from the user using the terminal.
     * @async
     * @method
     * @param {String} question - The question to ask
     * @param {Bool} invalid - Display 'Wrong choice'
     * @returns {Object} - The answer to the question or error if any
     */
    ask: async (question, invalid) => {
        const rl = readline.createInterface({ input, output });
        try {
            if (invalid) console.error(chalk.red(`Invalid Choice. Please try again.`));
            return { answer: await rl.question(chalk.yellow(question)) };
        }
        catch (error) {
            return { error };
        }
        finally {
            rl.close();
        }
    },

    /**
     * Clears the console
     * @method
     */
    clear: () => console.clear()
}