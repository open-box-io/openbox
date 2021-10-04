import { GatewayServer, SlashCreator } from 'slash-create';

import { Player } from 'discord-player';
import { attachPlayer } from './player/attachPlayer';
import { commands } from './commands/command';
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

export const player = new Player(client);
attachPlayer(player);

client.once(`ready`, () => {
    client.user?.setActivity(`open-box.io`, {
        type: `PLAYING`,
        url: `open-box.io`,
    });
});

const creator = new SlashCreator({
    applicationID: process.env.BOT_ID || ``,
    token: process.env.BOT_TOKEN,
});

creator
    .withServer(
        new GatewayServer((handler) =>
            client.ws.on(`INTERACTION_CREATE`, handler),
        ),
    )
    .registerCommands(commands);

creator.syncCommands();

// client.on(`interactionCreate`, async (interaction) => {
//     if (!interaction.isCommand()) return;

//     getCommand(interaction.commandName)?.execute(interaction, client, player);
// });

client.login(process.env.BOT_TOKEN);
