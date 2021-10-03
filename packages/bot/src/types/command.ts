import discord from 'discord.js';

export interface Command {
    command: discord.ApplicationCommandData;
    execute: (interaction: discord.CommandInteraction) => void;
}
