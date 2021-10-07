import { ComponentActionRow, Message, MessageEmbedOptions } from 'slash-create';
import { MessageActionRow, MessageButton } from 'discord.js';
import { Queue, QueueRepeatMode } from 'discord-player';

import { MUSIC } from './emoji';
import { playerInstances, removePlayerInstance } from '../app';
import { getServerById } from './server';

export interface options {
    playing: boolean;
    likedTrack?: boolean;
    repeatMode?: QueueRepeatMode;
}

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
    options?: options,
): Promise<void> => {
    const playerInstance = playerInstances.find(
        (instance) => queue.guild.id === instance.guild.id,
    );

    if (!playerInstance) {
        const message: Message = await queue.metadata.send({
            embeds: [formatPlaylistEmbed(queue)],
            components: await formatPlaylistButtons(queue, options),
        });

        playerInstances.push({
            guild: queue.guild,
            message: message,
        });
    } else {
        playerInstance.message.edit({
            embeds: [formatPlaylistEmbed(queue)],
            components: <ComponentActionRow[]>(
                (<unknown>await formatPlaylistButtons(queue, options))
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
                return `${index + queue.tracks.length}. [**${
                    track.title
                }**](${track.url})`;
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
    options?: options,
): MessageButton => {
    let playing = queue.playing;
    if (options) playing = options.playing;

    return playing ?
        new MessageButton()
            .setCustomId(`pause`)
            .setEmoji(MUSIC.PAUSE)
            .setStyle(`PRIMARY`)
        : new MessageButton()
            .setCustomId(`play`)
            .setEmoji(MUSIC.PLAY)
            .setStyle(`DANGER`);
};

export const formatLikeButton = async (
    queue: Queue<unknown>,
    options?: options,
): Promise<MessageButton> => {
    const track = queue.nowPlaying().url;

    let likedTrack = false;
    if (options && options.likedTrack !== undefined)
        likedTrack = options.likedTrack;
    else {
        const { playList } = await getServerById(queue.guild.id);
        likedTrack = playList.includes(track);
    }

    return likedTrack ?
        new MessageButton()
            .setCustomId(`unlike`)
            .setEmoji(MUSIC.UNLIKE)
            .setStyle(`PRIMARY`)
        : new MessageButton()
            .setCustomId(`like`)
            .setEmoji(MUSIC.LIKE)
            .setStyle(`PRIMARY`);
};

export const formatLoopButton = (
    queue: Queue<unknown>,
    options?: options,
): MessageButton => {
    let repeatMode = queue.repeatMode;
    if (options && options.repeatMode) repeatMode = options.repeatMode;

    return repeatMode === QueueRepeatMode.TRACK ?
        new MessageButton()
            .setCustomId(`loop`)
            .setEmoji(MUSIC.LOOPTRACK)
            .setStyle(`SUCCESS`)
        : repeatMode === QueueRepeatMode.QUEUE ?
            new MessageButton()
                .setCustomId(`loop`)
                .setEmoji(MUSIC.LOOP)
                .setStyle(`SUCCESS`)
            : new MessageButton()
                .setCustomId(`loop`)
                .setEmoji(MUSIC.LOOP)
                .setStyle(`SECONDARY`);
};

export const formatPlaylistButtons = async (
    queue: Queue<unknown>,
    options?: options,
): Promise<MessageActionRow[]> => {
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
        await formatLikeButton(queue),
        formatLoopButton(queue),
        new MessageButton()
            .setCustomId(`shuffle`)
            .setEmoji(MUSIC.SHUFFLE)
            .setStyle(`PRIMARY`),
    );

    return [topRow, secondRow];
};
