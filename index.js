import { Game } from "./src/models/game.js";
import { cli } from "./src/utils/cli.js";

/**
 * Main Function
 */
(async () => {
    const settings = [], questions = [];

    let reset, errorMessage;

    do {
        // Reset Inputs
        while (settings.length > 0) settings.pop();

        questions.push(
            { title: 'Max Concurrent Instances', q: 'Maximum number of concurrent instances: ' },
            { title: 'Tank Players', q: 'Number of Tank players in the queue: ' },
            { title: 'Healer Players', q: 'Number of Healer players in the queue: ' },
            { title: 'DPS Players', q: 'Number of DPS players in the queue: ' },
            { title: 'Minimum Time', q: 'Minimum time before an instance is finished: ' },
            { title: 'Maximum Time', q: 'Maximum time before an instance is finished: ' }
        );

        errorMessage = '';

        // Getting the inputs
        do {
            cli.info(`Welcome to the Process Synchronization Simulator!`, { clear: true });

            cli.info(`\nBefore we can proceed, please enter the following inputs.\nI shall summarize your inputs in a settings.\n`);

            if (settings.length > 0) cli.table(settings, { reduce: true });

            if (errorMessage) cli.error(errorMessage);

            const { answer, error } = await cli.ask(questions[0].q);

            if (error) return cli.error(error);

            if (answer == 'exit') return cli.error(`Program terminated by user.`, true);

            // Check if answer is an integer
            if (isNaN(parseInt(answer))) {
                errorMessage = `Invalid input. Please enter an integer.`;
                continue;
            }
            else {
                errorMessage = ``;
                settings.push({ Settings: questions[0].title, Value: parseInt(answer) });
                questions.shift();
            }
        }
        while (questions.length > 0);

        // Display Settings
        cli.info(`Proceeding with the Simulation with the following Settings.`, { clear: true });

        cli.table(settings, { reduce: true });

        // Retrieve Values from Settings
        const [instances, tanks, healers, dps, min, max] = settings.map(setting => setting.Value);

        const game = new Game({ tanks, healers, dps }, { instances, min, max });

        // Play the Game
        await game.play();

        // Check if the user wants to try again.
        const { answer, error } = await cli.ask(`Try again? [Y/n]: `);

        if (error) return cli.error(error);

        reset = !((answer == 'exit') || answer.toUpperCase() != 'Y');
    }
    while (reset);

    cli.info(`\nThank you for using this program!`);
})();