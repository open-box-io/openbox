import {
    CommandContext,
    CommandOptionType,
    SlashCommand,
    SlashCreator,
} from 'slash-create';

import { player } from '../../app';

export class queue extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, {
            name: `queue`,
            description: `See the queue`,
            options: [
                {
                    name: `page`,
                    type: CommandOptionType.INTEGER,
                    description: `Specific page number in queue`,
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
        if (!ctx.options.page) ctx.options.page = 1;
        const pageStart = 10 * (ctx.options.page - 1);
        const pageEnd = pageStart + 10;
        const currentTrack = queue.current;
        const tracks = queue.tracks
            .slice(pageStart, pageEnd)
            .map((track, index) => {
                return `${index + pageStart + 1}. **${track.title}** ([link](${
                    track.url
                }))`;
            });

        return void ctx.sendFollowUp({
            embeds: [
                {
                    title: `Server Queue`,
                    description: `${tracks.join(`\n`)}${
                        queue.tracks.length > pageEnd ?
                            `\n...${
                                queue.tracks.length - pageEnd
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
