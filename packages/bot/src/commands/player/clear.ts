import { CommandContext, SlashCommand, SlashCreator } from 'slash-create';

import { player } from '../../app';

export class clear extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: `clear`,
            description: `Clear the current queue.`,

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
        if (!queue)
            return void ctx.send({
                content: `There is no music in the queue.`,
                ephemeral: true,
            });

        queue.clear();

        ctx.send({ content: `Queue cleared.`, ephemeral: true });
    }
}
