import { Button } from '../button';
import { Interaction } from 'discord.js';
import { deleteQueueMessage } from '../../helpers/message';
import { player } from '../../app';

export const stop: Button = {
    name: `stop`,
    run: (interaction: Interaction): void => {
        if (!interaction.guildId) return;

        const queue = player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return;

        queue.destroy();
        deleteQueueMessage(queue);
    },
};
