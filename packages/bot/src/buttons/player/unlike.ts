import { Button } from '../button';
import { Interaction } from 'discord.js';
import { player } from '../../app';
import { unlikeTrack } from '../../helpers/server';
import { updateQueueMessage } from '../../helpers/message';

export const unlike: Button = {
    name: `unlike`,
    run: (interaction: Interaction): void => {
        if (!interaction.guildId) return;

        const queue = player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return;

        const currentTrack = queue.nowPlaying().url;

        unlikeTrack(interaction.guildId, currentTrack);

        updateQueueMessage(queue, {
            playing: queue.playing,
            likedTrack: false,
        });
    },
};
