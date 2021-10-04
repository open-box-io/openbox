import {
    CommandContext,
    CommandOptionType,
    SlashCommand,
    SlashCreator,
} from 'slash-create';

import { QueueRepeatMode } from 'discord-player';
import { player } from '../../app';

export class loop extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: `loop`,
            description: `Set loop mode`,
            options: [
                {
                    name: `mode`,
                    type: CommandOptionType.INTEGER,
                    description: `Loop type`,
                    required: true,
                    choices: [
                        {
                            name: `Off`,
                            value: QueueRepeatMode.OFF,
                        },
                        {
                            name: `Track`,
                            value: QueueRepeatMode.TRACK,
                        },
                        {
                            name: `Queue`,
                            value: QueueRepeatMode.QUEUE,
                        },
                        {
                            name: `Autoplay`,
                            value: QueueRepeatMode.AUTOPLAY,
                        },
                    ],
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
            return void ctx.send({
                content: `No music is being played.`,
                ephemeral: true,
            });
        const loopMode = ctx.options.mode;
        const success = queue.setRepeatMode(loopMode);
        const mode
            = loopMode === QueueRepeatMode.TRACK ?
                `🔂`
                : loopMode === QueueRepeatMode.QUEUE ?
                    `🔁`
                    : `▶`;
        return void ctx.send({
            content: success ?
                `${mode} | Updated loop mode.`
                : `Could not update loop mode.`,
            ephemeral: true,
        });
    }
}
