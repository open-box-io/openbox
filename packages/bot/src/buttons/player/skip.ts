import { Button } from '../button';
import { Interaction } from 'discord.js';
import { player } from '../../app';

export const skip: Button = {
    name: `skip`,
    run: (interaction: Interaction): void => {
        if (!interaction.guildId) return;

        const queue = player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return;

        queue.skip();
    },
};
