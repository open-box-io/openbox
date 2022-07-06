import { wsConnect, wsDisconnect, wsMessage } from './ws/ws';

import { Lobby } from '@openbox/common/src/types/lobbyTypes';
import ws from 'ws';

const wss = new ws.WebSocketServer({ port: 80 });

export const lobbies: Lobby[] = [];

wss.on(`connection`, (socket) => {
    wsConnect(lobbies, socket);

    socket.on(`message`, (messageAsString: string) => {
        const message = JSON.parse(messageAsString);

        wsMessage(lobbies, socket, message);
    });

    wss.on(`close`, () => {
        wsDisconnect(lobbies, socket);
    });
});

console.log(`wss up`);
