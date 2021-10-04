import {
    CommandContext,
    CommandOptionType,
    SlashCommand,
    SlashCreator,
} from 'slash-create';

import { player } from '../../app';

export class jump extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: `jump`,
            description: `Jump to a specific track`,
            options: [
                {
                    name: `tracks`,
                    description: `The number of tracks to skip`,
                    type: CommandOptionType.INTEGER,
                },
            ],

            guildIDs: process.env.DISCORD_GUILD_ID ?
                [process.env.DISCORD_GUILD_ID]
                : undefined,
        });
    }

    async run(ctx: CommandContext) {
        if (!ctx.guildID) {
            ctx.send({
                content: `This command must be sent in a server.`,
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

        const trackIndex = ctx.options.tracks - 1;
        const trackName = queue.tracks[trackIndex].title;
        queue.jump(trackIndex);

        ctx.send({
            content: `**${trackName}** has jumped the queue!`,
            ephemeral: true,
        });
    }
}
