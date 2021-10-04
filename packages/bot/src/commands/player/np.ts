import { CommandContext, SlashCommand, SlashCreator } from 'slash-create';

import { player } from '../../app';

export class np extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: `np`,
            description: `See what's currently being played`,

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
        const progress = queue.createProgressBar();
        const perc = queue.getPlayerTimestamp();

        return void ctx.send({
            embeds: [
                {
                    title: `Now Playing`,
                    description: `**${queue.current.title}** (\`${perc.progress}%\`)`,
                    fields: [
                        {
                            name: `\u200b`,
                            value: progress.replace(/ 0:00/g, `LIVE`),
                        },
                    ],
                    color: 0xffffff,
                },
            ],
            ephemeral: true,
        });
    }
}
