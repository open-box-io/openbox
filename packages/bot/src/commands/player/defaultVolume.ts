import {
    CommandContext,
    CommandOptionType,
    SlashCommand,
    SlashCreator,
} from 'slash-create';
import { getServerById, updateServerDefaultVolume } from '../../helpers/server';

import { player } from '../../app';

export class defaultVolume extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: `default_volume`,
            description: `Set the default music volume`,
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

        const server = await getServerById(ctx.guildID);

        const vol = parseInt(ctx.options.amount);
        if (!vol)
            return void ctx.sendFollowUp({
                content: `Current default volume is **${server.defaultVolume}**%!`,
                ephemeral: true,
            });
        if (vol < 0 || vol > 100)
            return void ctx.sendFollowUp({
                content: `Volume range must be 0-100`,
                ephemeral: true,
            });

        const queue = player.getQueue(ctx.guildID);
        if (queue && queue.playing) {
            queue.setVolume(vol);
        }

        updateServerDefaultVolume(ctx.guildID, vol);

        return void ctx.sendFollowUp({
            content: `Default volume set to **${vol}%**!`,
            ephemeral: true,
        });
    }
}
