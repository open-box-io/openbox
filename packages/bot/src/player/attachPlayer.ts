/* eslint-disable @typescript-eslint/no-explicit-any */

import { Player, Queue } from 'discord-player';

import { Message } from 'slash-create';

export const attachPlayer = (player: Player): void => {
    player.on(`error`, (queue, error) => {
        console.log(
            `[${queue.guild.name}] Error emitted from the queue: ${error.message}`,
        );
    });
    player.on(`connectionError`, (queue, error) => {
        console.log(
            `[${queue.guild.name}] Error emitted from the connection: ${error.message}`,
        );
    });

    player.on(`trackStart`, (queue: Queue<any>, track) => {
        queue.metadata
            .send(
                `Now playing: **${track.title}** in **${queue.connection.channel.name}**!`,
            )
            .then((msg: Message) => {
                setTimeout(() => msg.delete(), 10000);
            });
    });

    player.on(`trackAdd`, (queue: Queue<any>, track) => {
        queue.metadata
            .send(`**${track.title}** added to the queue`)
            .then((msg: Message) => {
                setTimeout(() => msg.delete(), 10000);
            });
    });

    player.on(`botDisconnect`, (queue: Queue<any>) => {
        queue.metadata
            .send(
                `❌ | I was manually disconnected from the voice channel, clearing queue!`,
            )
            .then((msg: Message) => {
                setTimeout(() => msg.delete(), 60000);
            });
    });

    player.on(`channelEmpty`, (queue: Queue<any>) => {
        queue.metadata
            .send(`❌ | Nobody is in the voice channel, leaving...`)
            .then((msg: Message) => {
                setTimeout(() => msg.delete(), 60000);
            });
    });

    player.on(`queueEnd`, (queue: Queue<any>) => {
        queue.metadata.send(`✅ | Queue finished!`).then((msg: Message) => {
            setTimeout(() => msg.delete(), 60000);
        });
    });
};
