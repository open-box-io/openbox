import { CommandContext, SlashCommand, SlashCreator } from 'slash-create';

import { player } from '../../app';

export class skip extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: `skip`,
            description: `Skip to the current song`,

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
        const currentTrack = queue.current;
        const success = queue.skip();
        return void ctx.sendFollowUp({
            content: success ?
                `Skipped **${currentTrack}**!`
                : `Something went wrong!`,
            ephemeral: true,
        });
    }
}
