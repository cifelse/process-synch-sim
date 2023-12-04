import { Sema } from 'async-sema';
import { DEFAULTS } from './constants.js';

/**
 * The Game Class that will simulate the process synchronization
 */
export class Game {
    // Set of Default Values
    constructor(players, settings) {
        const { tanks, dps, healers } = players;

        if (typeof tanks !== 'number') 
            throw new Error(`Tanks must be a number.`);

        if (typeof dps !== 'number')
            throw new Error(`DPS must be a number.`);
    
        if (typeof healers !== 'number')
            throw new Error(`Healers must be a number.`);

        this.players = players;

        console.log(tanks + dps + healers);
        
        this.totalPlayers = tanks + dps + healers;

        const { instances, min, max } = settings;

        if (typeof instances !== 'number')
            throw new Error(`Instances must be a number.`);

        if (typeof min !== 'number')
            throw new Error(`Min must be a number.`);

        if (typeof max !== 'number')
            throw new Error(`Max must be a number.`);

        this.settings = settings;
    }

    /**
     * Get the number of Tanks
     */
    get tanks() {
        const { tanks } = this.settings;

        return tanks ? tanks : 0;
    }

    /**
     * Get the number of DPS
     */
    get dps() {
        const { dps } = this.settings;

        return dps ? dps : 0;
    }

    /**
     * Get the number of Healers
     */
    get healers() {
        const { healers } = this.settings;

        return healers ? healers : 0;
    }

    get totalPlayers() {
        const { totalPlayers } = this.settings;

        return totalPlayers ? totalPlayers : 0;
    }

    /**
     * Play the Game
     */
    async play () {
        // Form a Party
        const formParty = () => {
            const { Party } = DEFAULTS;

            this.dps = this.dps < Party.dps ? 0 : this.dps - Party.dps;

            this.tanks = this.tanks < Party.tank ? 0 : this.tanks - Party.tank;

            this.healers = this.healers < Party.healer ? 0 : this.healers - Party.healer;
        }

        // Get Random Number
        const getRnd = (min, max) => {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        const { instances, min, max } = this.settings;

        const sema = new Sema(instances, { capacity: instances });

        await Promise.all(
            this.players.map(async player => {
                await sema.acquire();

                const display = `${this.totalPlayers} is playing...`;

                console.log(display);

                await new Promise(resolve =>
                    setTimeout(resolve, getRnd(min, max))
                );

                sema.release();
            })
        );
    }
}