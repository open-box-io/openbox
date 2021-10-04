import {
    CommandContext,
    CommandOptionType,
    SlashCommand,
    SlashCreator,
} from 'slash-create';

import { player } from '../../app';

export class remove extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: `remove`,
            description: `Remove a specific track`,
            options: [
                {
                    name: `track`,
                    description: `The number of the track to remove`,
                    type: CommandOptionType.INTEGER,
                    required: true,
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
        if (!queue)
            return void ctx.sendFollowUp({
                content: `No music is being played!`,
                ephemeral: true,
            });

        const trackIndex = ctx.options.track - 1;
        const trackName = queue.tracks[trackIndex].title;
        queue.remove(trackIndex);

        ctx.sendFollowUp({
            content: `Removed track ${trackName}.`,
            ephemeral: true,
        });
    }
}
