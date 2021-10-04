import { CommandContext, SlashCommand, SlashCreator } from 'slash-create';

import { player } from '../../app';

export class resume extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: `resume`,
            description: `Resume the current song`,

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
        const paused = queue.setPaused(false);
        return void ctx.sendFollowUp({
            content: paused ? `Resumed!` : `Something went wrong!`,
            ephemeral: true,
        });
    }
}
