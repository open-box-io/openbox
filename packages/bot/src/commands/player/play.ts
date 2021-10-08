import {
    CommandContext,
    CommandOptionType,
    SlashCommand,
    SlashCreator,
} from 'slash-create';
import { client, player } from '../../app';

import { QueryType } from 'discord-player';
import { getServerById } from '../../helpers/server';

export class play extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: `play`,
            description: `Add a song to the queue`,

            options: [
                {
                    name: `liked`,
                    description: `play all liked songs`,
                    type: CommandOptionType.SUB_COMMAND,
                    required: true,
                },
                {
                    name: `search_term`,
                    type: CommandOptionType.STRING,
                    description: `The name of the song you want to play`,
                    required: true,
                },
            ],
        });
    }

    async run(ctx: CommandContext): Promise<void> {
        const guild = ctx.guildID ?
            client.guilds.cache.get(ctx.guildID)
            : undefined;
        if (!guild || !ctx.guildID) {
            ctx.send({
                content: `This command must be sent in a server.`,
                ephemeral: true,
            });
            return;
        }

        const member
            = guild.members.cache.get(ctx.user.id)
            ?? (await guild.members.fetch(ctx.user.id));
        if (!member) {
            ctx.send({
                content: `Could not find user.`,
                ephemeral: true,
            });
            return;
        }

        const channel = guild.channels.cache.get(ctx.channelID);

        const queue = await player.createQueue(guild, {
            metadata: channel,
        });

        const query = ctx.options.search_term;
        if (query === `liked`) {
            const { playList, defaultVolume } = await getServerById(
                ctx.guildID,
            );

            if (!member.voice.channel) {
                ctx.send({
                    content: `You must be in a voice channel.`,
                    ephemeral: true,
                });
                return;
            }

            if (!playList.length) {
                ctx.send({
                    content: `This server has no liked songs.`,
                    ephemeral: true,
                });
                return;
            }

            playList.forEach(async (track) => {
                const searchResult = await player.search(track, {
                    requestedBy: member,
                    searchEngine: QueryType.AUTO,
                });

                if (searchResult) {
                    searchResult.playlist ?
                        queue.addTracks(searchResult.tracks)
                        : queue.addTrack(searchResult.tracks[0]);
                }
            });

            try {
                if (!queue.connection) {
                    await queue.connect(member.voice.channel);
                    queue.setVolume(defaultVolume);
                }
            } catch {
                void player.deleteQueue(guild.id);
                ctx.send({
                    content: `Unable to join your voice channel.`,
                    ephemeral: true,
                });
                return;
            }

            ctx.send({
                content: `Playing liked songs`,
            });

            setTimeout(async () => (await ctx.fetch()).delete(), 10000);
        } else {
            const searchResult = await player.search(query, {
                requestedBy: member,
                searchEngine: QueryType.AUTO,
            });

            if (!searchResult || !searchResult.tracks.length) {
                ctx.send({
                    content: `${query} was not found.`,
                    ephemeral: true,
                });
                return;
            }

            if (!member.voice.channel) {
                ctx.send({
                    content: `You must be in a voice channel.`,
                    ephemeral: true,
                });
                return;
            }

            try {
                if (!queue.connection) {
                    const { defaultVolume } = await getServerById(ctx.guildID);

                    await queue.connect(member.voice.channel);
                    queue.setVolume(defaultVolume);
                }
            } catch {
                void player.deleteQueue(guild.id);
                ctx.send({
                    content: `Unable to join your voice channel.`,
                    ephemeral: true,
                });
                return;
            }

            searchResult.playlist ?
                queue.addTracks(searchResult.tracks)
                : queue.addTrack(searchResult.tracks[0]);

            const track = searchResult.tracks[0];
            ctx.send({
                content: `Added to Queue: **${track.title}**`,
            });

            setTimeout(async () => (await ctx.fetch()).delete(), 10000);

            if (!queue.playing) await queue.play();
        }
    }
}
