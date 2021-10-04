import { CommandContext, SlashCommand, SlashCreator } from 'slash-create';

import { player } from '../../app';

export class pause extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: `pause`,
            description: `Pause the current song`,

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
        const paused = queue.setPaused(true);
        return void ctx.send({
            content: paused ? `Paused!` : `Something went wrong!`,
            ephemeral: true,
        });
    }
}
