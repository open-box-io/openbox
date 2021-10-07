import { Button } from '../button';
import { Interaction } from 'discord.js';
import { likeTrack } from '../../helpers/server';
import { player } from '../../app';
import { updateQueueMessage } from '../../helpers/message';

export const like: Button = {
    name: `like`,
    run: (interaction: Interaction): void => {
        if (!interaction.guildId) return;

        const queue = player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return;

        const currentTrack = queue.nowPlaying().url;

        likeTrack(interaction.guildId, currentTrack);

        updateQueueMessage(queue, {
            playing: queue.playing,
            likedTrack: true,
        });
    },
};
