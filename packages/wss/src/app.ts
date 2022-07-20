import { wsConnect, wsDisconnect, wsMessage } from './wss/wss';

import { Lobby } from '@openbox/common/src/types/lobbyTypes';
import ws from 'ws';

const wss = new ws.WebSocketServer({ port: 80 });

export const lobbies: Lobby[] = [];

const interval = setInterval(() => {
    console.log(`${lobbies.length} LOBBIES`);

    lobbies.forEach((lobby) => {
        lobby.players.forEach((player) => {
            if (player.missedPings === 1) {
                player.websocket.terminate();
            } else {
                player.missedPings = 1;
                player.websocket.ping();
            }
        });
    });
}, 2000);

wss.on(`connection`, async (socket, request) => {
    const result = await wsConnect(lobbies, socket, request);
    if (!result) return;

    const { player, lobby } = result;

    socket.on(`pong`, () => (player.missedPings = 0));
    socket.on(`message`, (messageAsString: string) => {
        const message = JSON.parse(messageAsString);

        wsMessage(player, lobby, socket, message);
    });

    //try changing to socket.on
    wss.on(`close`, () => {
        wsDisconnect(lobbies, player, lobby, socket);
    });

    wss.on(`close`, function close() {
        clearInterval(interval);
    });
});

console.log(`WSS RUNNING`);
