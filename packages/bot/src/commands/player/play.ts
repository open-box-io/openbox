import { Command } from '../../types/command';
import { QueryType } from 'discord-player';
import discord from 'discord.js';

export const play: Command = {
    command: {
        name: `play`,
        description: `Add a song to the queue`,

        options: [
            {
                name: `search_term`,
                type: discord.Constants.ApplicationCommandOptionTypes.STRING,
                description: `The name of the song you want to play`,
                required: true,
            },
        ],
    },

    execute: async (interaction, client, player) => {
        const guild = interaction.guildId ?
            client.guilds.cache.get(interaction.guildId)
            : undefined;

        if (!guild) {
            interaction.reply({
                content: `You must be in a server to play songs.`,
                ephemeral: true,
            });
            return;
        }

        const channel = guild.channels.cache.get(interaction.channelId);
        const query = interaction.options.getString(`search_term`);

        if (!query) {
            interaction.reply({
                content: `Please provide a song title.`,
                ephemeral: true,
            });
            return;
        }

        const searchResult = await player.search(query, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO,
        });

        if (!searchResult || !searchResult.tracks.length) {
            interaction.reply({
                content: `${query} was not found.`,
                ephemeral: true,
            });
            return;
        }

        const queue = await player.createQueue(guild, {
            metadata: channel,
        });

        const member
            = guild.members.cache.get(interaction.user.id)
            ?? (await guild.members.fetch(interaction.user.id));

        if (!member.voice.channel) {
            interaction.reply({
                content: `You must be in a voice channel.`,
                ephemeral: true,
            });
            return;
        }

        try {
            if (!queue.connection) await queue.connect(member.voice.channel);
        } catch {
            void player.deleteQueue(guild.id);
            interaction.reply({
                content: `Unable to join your voice channel.`,
                ephemeral: true,
            });
            return;
        }

        interaction.reply({
            content: `Queued: ${searchResult.tracks[0].source}`,
        });

        searchResult.playlist ?
            queue.addTracks(searchResult.tracks)
            : queue.addTrack(searchResult.tracks[0]);
        if (!queue.playing) await queue.play();
    },
};
