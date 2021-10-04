import { CommandContext, SlashCommand, SlashCreator } from 'slash-create';

import { player } from '../../app';

export class bassboost extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: `bassboost`,
            description: `Toggle bassboost filter.`,

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
                content: `No music is being played.`,
                ephemeral: true,
            });
        await queue.setFilters({
            bassboost: !queue.getFiltersEnabled().includes(`bassboost`),
            normalizer2: !queue.getFiltersEnabled().includes(`bassboost`),
        });

        setTimeout(() => {
            return void ctx.send({
                content: `Bassboost ${
                    queue.getFiltersEnabled().includes(`bassboost`) ?
                        `Enabled.`
                        : `Disabled.`
                }!`,
                ephemeral: true,
            });
        }, queue.options.bufferingTimeout);
    }
}
