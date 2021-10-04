import { CommandContext, SlashCommand, SlashCreator } from 'slash-create';

import { player } from '../../app';

export class back extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: `back`,
            description: `Play the previous track.`,
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

        await queue.back();

        ctx.send({
            content: `Playing the previous track.`,
            ephemeral: true,
        });
    }
}
