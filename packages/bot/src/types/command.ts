import { Player } from 'discord-player';
import discord from 'discord.js';

export interface Command {
    command: discord.ApplicationCommandData;
    execute: (
        interaction: discord.CommandInteraction,
        client: discord.Client,
        player: Player
    ) => void;
}
