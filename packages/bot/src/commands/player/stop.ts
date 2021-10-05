import { CommandContext, SlashCommand, SlashCreator } from 'slash-create';

import { deleteQueueMessage } from '../../helpers/message';
import { player } from '../../app';

export class stop extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: `stop`,
            description: `Stop the player`,

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
                ephemeral: true,
            });
        queue.destroy();
        deleteQueueMessage(queue);

        return void ctx.sendFollowUp({
            content: `Stopped the player!`,
            ephemeral: true,
        });
    }
}
