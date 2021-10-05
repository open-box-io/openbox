import { CommandContext, SlashCommand, SlashCreator } from 'slash-create';

export class ping extends SlashCommand {
    constructor(creator: SlashCreator) {
        super(creator, { name: `ping`, description: `pong` });
    }

    async run(ctx: CommandContext): Promise<void> {
        ctx.send({
            content: `pong`,
            ephemeral: true,
        });
    }
}
