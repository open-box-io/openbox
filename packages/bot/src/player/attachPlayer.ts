/* eslint-disable @typescript-eslint/no-explicit-any */

import { Player, Queue } from 'discord-player';
import { deleteQueueMessage, updateQueueMessage } from '../helpers/message';

import { Message } from 'slash-create';

export const attachPlayer = (player: Player): void => {
    player.on(`error`, (queue, error) => {
        updateQueueMessage(queue);

        console.log(
            `[${queue.guild.name}] Error emitted from the queue: ${error.message}`,
        );
    });
    player.on(`connectionError`, (queue, error) => {
        deleteQueueMessage(queue);

        console.log(
            `[${queue.guild.name}] Error emitted from the connection: ${error.message}`,
        );
    });

    player.on(`trackStart`, (queue: Queue<any>) => {
        updateQueueMessage(queue);
    });

    player.on(`trackAdd`, async (queue: Queue<any>) => {
        updateQueueMessage(queue);
    });

    player.on(`botDisconnect`, (queue: Queue<any>) => {
        deleteQueueMessage(queue);

        queue.metadata
            .send(
                `I was manually disconnected from the voice channel, clearing queue!`,
            )
            .then((msg: Message) => {
                setTimeout(() => msg.delete(), 10000);
            });
    });

    player.on(`channelEmpty`, (queue: Queue<any>) => {
        deleteQueueMessage(queue);

        queue.metadata
            .send(`Nobody is in the voice channel, leaving...`)
            .then((msg: Message) => {
                setTimeout(() => msg.delete(), 10000);
            });
    });

    player.on(`queueEnd`, (queue: Queue<any>) => {
        deleteQueueMessage(queue);

        queue.metadata.send(`Queue finished!`).then((msg: Message) => {
            setTimeout(() => msg.delete(), 10000);
        });
    });
};
