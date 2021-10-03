import { Command } from '../../types/command';

export const ping: Command = {
    command: { name: `ping`, description: `pong` },

    execute: (interaction) => {
        interaction.reply({
            content: `pong`,
            ephemeral: true,
        });
    },
};
