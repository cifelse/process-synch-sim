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

        this.players = { tanks, dps, healers };

        this.totalPlayers = (tanks + dps + healers);

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

    /**
     * Create a Party from the Pool of Players
     * @method
     * @returns {Object} - The Playing Party
     */
    formParty () {
        const { Party } = DEFAULTS;

        const { tanks, dps, healers } = this.players;

        // Get the people playing
        const dpsPlaying = dps < Party.dps ? dps : Party.dps;

        const tanksPlaying = tanks < Party.tank ? tanks : Party.tank;

        const healersPlaying = healers < Party.healer ? healers : Party.healer;

        // Subtract to the actual
        this.players = { 
            tanks: tanks - tanksPlaying, 
            dps: dps - dpsPlaying, 
            healers: healers - healersPlaying
        };

        this.totalPlayers -= (dpsPlaying + tanksPlaying + healersPlaying);

        // Returning Party
        return { 
            dps: dpsPlaying, 
            tanks: tanksPlaying, 
            healers: healersPlaying,
            total: (dpsPlaying + tanksPlaying + healersPlaying)
        };
    }

    /**
     * Play an actual Dungeon Run
     * @method
     * @param {Number} min
     * @param {Number} max 
     * @returns {Number} - Duration to finish the Dungeon
     */
    play (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}