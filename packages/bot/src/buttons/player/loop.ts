import { Button } from '../button';
import { Interaction } from 'discord.js';
import { QueueRepeatMode } from 'discord-player';
import { player } from '../../app';
import { updateQueueMessage } from '../../helpers/message';

export const loop: Button = {
    name: `loop`,
    run: (interaction: Interaction): void => {
        if (!interaction.guildId) return;

        const queue = player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return;

        let repeatMode = QueueRepeatMode.OFF;

        switch (queue.repeatMode) {
        case QueueRepeatMode.OFF:
            repeatMode = QueueRepeatMode.QUEUE;
            break;
        case QueueRepeatMode.QUEUE:
            repeatMode = QueueRepeatMode.TRACK;
            break;
        case QueueRepeatMode.TRACK:
            repeatMode = QueueRepeatMode.OFF;
            break;
        }

        queue.setRepeatMode(repeatMode);
        updateQueueMessage(queue, {
            playing: queue.playing,
            repeatMode: repeatMode,
        });
    },
};
