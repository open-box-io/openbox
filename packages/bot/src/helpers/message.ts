import { ComponentActionRow, Message, MessageEmbedOptions } from 'slash-create';
import { MessageActionRow, MessageButton } from 'discord.js';
import { Queue, QueueRepeatMode } from 'discord-player';

import { MUSIC } from './emoji';
import { playerInstances, removePlayerInstance } from '../app';

export const deleteQueueMessage = async (queue: Queue<any>): Promise<void> => {
    const playerInstance = playerInstances.find(
        (instance) => queue.guild.id === instance.guild.id,
    );

    if (!playerInstance) return;
    removePlayerInstance(queue.guild.id);

    await playerInstance.message.delete().catch(() => undefined);
};

export const updateQueueMessage = async (
    queue: Queue<any>,
    options?: { playing?: boolean; repeatMode?: QueueRepeatMode },
): Promise<void> => {
    const playerInstance = playerInstances.find(
        (instance) => queue.guild.id === instance.guild.id,
    );

    if (!playerInstance) {
        const message: Message = await queue.metadata.send({
            embeds: [formatPlaylistEmbed(queue)],
            components: formatPlaylistButtons(queue, options),
        });

        playerInstances.push({
            guild: queue.guild,
            message: message,
        });
    } else {
        playerInstance.message.edit({
            embeds: [formatPlaylistEmbed(queue)],
            components: <ComponentActionRow[]>(
                (<unknown>formatPlaylistButtons(queue, options))
            ),
        });

        playerInstance.message.components;
    }
};

export const formatPlaylistEmbed = (
    queue: Queue<unknown>,
): MessageEmbedOptions => {
    const firstTracks = queue.tracks
        .slice(0, queue.tracks.length > 7 ? 5 : 7)
        .map((track, index) => {
            return `${index + 1}. [**${track.title}**](${track.url})`;
        });
    const lastTracks
        = queue.tracks.length > 7 ?
            queue.tracks.slice(-2).map((track, index) => {
                return `${index + queue.tracks.length}. ([**${
                    track.title
                }**](${track.url}))`;
            })
            : [];

    return {
        title: `Current Queue`,
        description: `${firstTracks.join(`\n`)}\n${
            queue.tracks.length > 6 ? `...\n` : ``
        }${lastTracks.join(`\n`)}`,
        color: 0x47bdff,
        fields: [
            {
                name: `Now Playing`,
                value: `[**${queue.current.title}**](${queue.current.url})`,
            },
        ],
    };
};

export const formatPlayButton = (
    queue: Queue<unknown>,
    options?: { playing?: boolean; repeatMode?: QueueRepeatMode },
): MessageButton => {
    console.log(
        `playing`,
        options && options.playing,
        !options && queue.playing,
        (options && options.playing) || (!options && queue.playing),
    );
    return (options && options.playing) || (!options && queue.playing) ?
        new MessageButton()
            .setCustomId(`pause`)
            .setEmoji(MUSIC.PAUSE)
            .setStyle(`PRIMARY`)
        : new MessageButton()
            .setCustomId(`play`)
            .setEmoji(MUSIC.PLAY)
            .setStyle(`DANGER`);
};

export const formatLoopButton = (
    queue: Queue<unknown>,
    options?: { playing?: boolean; repeatMode?: QueueRepeatMode },
): MessageButton => {
    return (options && options.repeatMode === QueueRepeatMode.TRACK)
        || (!options && queue.repeatMode === QueueRepeatMode.TRACK) ?
        new MessageButton()
            .setCustomId(`loop`)
            .setEmoji(MUSIC.LOOPTRACK)
            .setStyle(`SUCCESS`)
        : (options && options.repeatMode === QueueRepeatMode.QUEUE)
          || (!options && queue.repeatMode === QueueRepeatMode.QUEUE) ?
            new MessageButton()
                .setCustomId(`loop`)
                .setEmoji(MUSIC.LOOP)
                .setStyle(`SUCCESS`)
            : new MessageButton()
                .setCustomId(`loop`)
                .setEmoji(MUSIC.LOOP)
                .setStyle(`SECONDARY`);
};

export const formatPlaylistButtons = (
    queue: Queue<unknown>,
    options?: { playing?: boolean; repeatMode?: QueueRepeatMode },
): MessageActionRow[] => {
    const topRow = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId(`back`)
            .setEmoji(MUSIC.BACK)
            .setStyle(`PRIMARY`),
        formatPlayButton(queue, options),
        new MessageButton()
            .setCustomId(`skip`)
            .setEmoji(MUSIC.SKIP)
            .setStyle(`PRIMARY`),
    );

    const secondRow = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId(`stop`)
            .setEmoji(MUSIC.STOP)
            .setStyle(`PRIMARY`),
        formatLoopButton(queue),
        new MessageButton()
            .setCustomId(`shuffle`)
            .setEmoji(MUSIC.SHUFFLE)
            .setStyle(`PRIMARY`),
    );

    return [topRow, secondRow];
};
