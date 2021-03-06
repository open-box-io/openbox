import { Lobby } from '@openbox/common/src/types/lobbyTypes';
import { Player } from '@openbox/common/src/types/playerTypes';
import { WebsocketMessage } from '@openbox/common/src/types/websocketTypes';
import { connect } from './connection/connect';
import { disconnect } from './connection/disconnect';
import dotenv from 'dotenv';
import { message } from './message/message';
import ws from 'ws';

dotenv.config();

export const wsConnect = async (
    lobbies: Lobby[],
    socket: ws.WebSocket,
    request: any,
): Promise<{ player: Player; lobby: Lobby } | undefined> => {
    try {
        const result = await connect(socket, lobbies, request);

        console.log(`SUCCESS`, 200, result.response);

        socket.send(
            JSON.stringify({
                statusCode: 200,
                body: result.response,
            }),
        );

        return { player: result.player, lobby: result.lobby };
    } catch (error: any) {
        console.log(`ERROR`, error.code ? error.code : 500, error);

        socket.send(
            JSON.stringify({
                statusCode: error.code ? error.code : 500,
                body: error,
            }),
        );
        return undefined;
    }
};

export const wsDisconnect = async (
    player: Player,
    lobby: Lobby,
): Promise<void> => {
    try {
        const result = await disconnect(player, lobby);

        console.log(`SUCCESS`, 200, result);
    } catch (error: any) {
        console.log(`ERROR`, error.code ? error.code : 500, error);
    }
};

export const wsMessage = async (
    player: Player,
    lobby: Lobby,
    socket: ws.WebSocket,
    wsMessage: { message: WebsocketMessage },
): Promise<void> => {
    try {
        const result = await message(socket, player, lobby, wsMessage);

        console.log(`SUCCESS`, 200, result);
    } catch (error: any) {
        console.log(`ERROR`, error.code ? error.code : 500, error);

        socket.send(
            JSON.stringify({
                statusCode: error.code ? error.code : 500,
                body: error,
            }),
        );
    }
};
