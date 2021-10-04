import {
    CommandContext,
    CommandOptionType,
    SlashCommand,
    SlashCreator,
} from 'slash-create';

import { player } from '../../app';

export class volume extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: `volume`,
            description: `Set music volume`,
            options: [
                {
                    name: `amount`,
                    type: CommandOptionType.INTEGER,
                    description: `The volume amount to set (0-100)`,
                    required: false,
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
                ephemeral: true,
            });
        const vol = parseInt(ctx.options.amount);
        if (!vol)
            return void ctx.sendFollowUp({
                content: `Current volume is **${queue.volume}**%!`,
                ephemeral: true,
            });
        if (vol < 0 || vol > 100)
            return void ctx.sendFollowUp({
                content: `Volume range must be 0-100`,
                ephemeral: true,
            });
        const success = queue.setVolume(vol);
        return void ctx.sendFollowUp({
            content: success ?
                `Volume set to **${vol}%**!`
                : `Something went wrong!`,
            ephemeral: true,
        });
    }
}
