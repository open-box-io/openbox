import {
    CommandContext,
    CommandOptionType,
    SlashCommand,
    SlashCreator,
} from 'slash-create';

import { player } from '../../app';

export class seek extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: `seek`,
            description: `Seek to the given time`,
            options: [
                {
                    name: `time`,
                    description: `The time to seek to (in seconds)`,
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
            return void ctx.sendFollowUp({
                content: `No music is being played!`,
            });

        const time = ctx.options.time * 1000;
        await queue.seek(time);

        ctx.sendFollowUp({ content: `Seeked to ${time / 1000} seconds` });
    }
}
