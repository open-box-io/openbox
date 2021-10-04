import {
    CommandContext,
    CommandOptionType,
    SlashCommand,
    SlashCreator,
} from 'slash-create';
import { client, player } from '../../app';

import { QueryType } from 'discord-player';

export class playnext extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: `playnext`,
            description: `Add a song to the top of the queue`,
            options: [
                {
                    name: `query`,
                    type: CommandOptionType.STRING,
                    description: `The song you want to play next`,
                    required: true,
                },
            ],

            guildIDs: process.env.DISCORD_GUILD_ID ?
                [process.env.DISCORD_GUILD_ID]
                : undefined,
        });
    }

    async run(ctx: CommandContext) {
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

        const queue = player.getQueue(ctx.guildID);
        if (!queue || !queue.playing)
            return void ctx.send({
                content: `No music is being played!`,
                ephemeral: true,
            });

        const query = ctx.options.query;
        const searchResult = await player.search(query, {
            requestedBy: member,
            searchEngine: QueryType.AUTO,
        });

        if (!searchResult || !searchResult.tracks.length)
            return void ctx.send({
                content: `No results were found!`,
                ephemeral: true,
            });
        queue.insert(searchResult.tracks[0]);
        await ctx.send({
            content: `Loading your track...`,
            ephemeral: true,
        });
    }
}
