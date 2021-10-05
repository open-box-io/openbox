import { Button } from '../button';
import { Interaction } from 'discord.js';
import { player } from '../../app';
import { updateQueueMessage } from '../../helpers/message';

export const pause: Button = {
    name: `pause`,
    run: (interaction: Interaction): void => {
        if (!interaction.guildId) return;

        const queue = player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return;

        queue.setPaused(true);
        updateQueueMessage(queue, { playing: false });
    },
};
