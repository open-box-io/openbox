import {
    CommandContext,
    CommandOptionType,
    SlashCommand,
    SlashCreator,
} from 'slash-create';

import { player } from '../../app';

export class history extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: `history`,
            description: `Display the queue history.`,
            options: [
                {
                    name: `page`,
                    type: CommandOptionType.INTEGER,
                    description: `Specific page number in queue history.`,
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
            return void ctx.send({
                content: `No music is being played!`,
                ephemeral: true,
            });
        if (!ctx.options.page) ctx.options.page = 1;
        const pageEnd = -10 * (ctx.options.page - 1) - 1;
        const pageStart = pageEnd - 10;
        const currentTrack = queue.current;
        const tracks = queue.previousTracks
            .slice(pageStart, pageEnd)
            .reverse()
            .map((m, i) => {
                return `${i + pageEnd * -1}. **${m.title}** ([link](${m.url}))`;
            });

        return void ctx.send({
            embeds: [
                {
                    title: `Server Queue History`,
                    description: `${tracks.join(`\n`)}${
                        queue.previousTracks.length > pageStart * -1 ?
                            `\n...${
                                queue.previousTracks.length + pageStart
                            } more track(s)`
                            : ``
                    }`,
                    color: 0xff0000,
                    fields: [
                        {
                            name: `Now Playing`,
                            value: `**${currentTrack.title}** ([link](${currentTrack.url}))`,
                        },
                    ],
                },
            ],
            ephemeral: true,
        });
    }
}
