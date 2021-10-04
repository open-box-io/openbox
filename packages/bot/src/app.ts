import { commands, getCommand } from './commands/command';

import { Player } from 'discord-player';
import discord from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();
export const client = new discord.Client({
    intents: [
        discord.Intents.FLAGS.GUILDS,
        discord.Intents.FLAGS.GUILD_MESSAGES,
        discord.Intents.FLAGS.GUILD_MEMBERS,
        discord.Intents.FLAGS.GUILD_VOICE_STATES,
    ],
});

const player = new Player(client);

client.once(`ready`, () => {
    client.user?.setActivity(`open-box.io`, {
        type: `PLAYING`,
    });

    const guildId = `713358142913904661`;
    const guild = client.guilds.cache.get(guildId);

    let clientCommands:
        | discord.GuildApplicationCommandManager
        | discord.ApplicationCommandManager<
              discord.ApplicationCommand<{ guild: discord.GuildResolvable }>,
              { guild: discord.GuildResolvable },
              null
          >
        | undefined;

    if (guild) {
        clientCommands = guild.commands;
    } else {
        clientCommands = client.application?.commands;
    }

    commands.forEach((command) => {
        if (clientCommands) {
            clientCommands.create(command.command);
        }
    });
});

client.on(`interactionCreate`, async (interaction) => {
    if (!interaction.isCommand()) return;

    getCommand(interaction.commandName)?.execute(interaction, client, player);
});

client.login(process.env.BOT_TOKEN);
