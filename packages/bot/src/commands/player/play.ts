import {
    CommandContext,
    CommandOptionType,
    SlashCommand,
    SlashCreator,
} from 'slash-create';
import { client, player } from '../../app';

import { QueryType } from 'discord-player';

export class play extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: `play`,
            description: `Add a song to the queue`,

            options: [
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
        if (!guild) {
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

        const query = ctx.options.search_term;
        if (!query) {
            ctx.send({
                content: `Please provide a song title.`,
                ephemeral: true,
            });
            return;
        }

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

        const queue = await player.createQueue(guild, {
            metadata: channel,
        });

        if (!member.voice.channel) {
            ctx.send({
                content: `You must be in a voice channel.`,
                ephemeral: true,
            });
            return;
        }

        try {
            if (!queue.connection) await queue.connect(member.voice.channel);
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

        ctx.send({
            content: `Queueing: ${searchResult.tracks[0]}`,
            ephemeral: true,
        });

        if (!queue.playing) await queue.play();
    }
}
