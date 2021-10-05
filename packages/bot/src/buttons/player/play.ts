import { Button } from '../button';
import { Interaction } from 'discord.js';
import { player } from '../../app';
import { updateQueueMessage } from '../../helpers/message';

export const play: Button = {
    name: `play`,
    run: (interaction: Interaction): void => {
        if (!interaction.guildId) return;

        const queue = player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return;

        queue.setPaused(false);
        updateQueueMessage(queue, { playing: true });
    },
};
