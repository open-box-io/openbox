import { Button } from '../button';
import { Interaction } from 'discord.js';
import { player } from '../../app';
import { updateQueueMessage } from '../../helpers/message';

export const shuffle: Button = {
    name: `shuffle`,
    run: (interaction: Interaction): void => {
        if (!interaction.guildId) return;

        const queue = player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return;

        queue.shuffle();
        updateQueueMessage(queue);
    },
};
