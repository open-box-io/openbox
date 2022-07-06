import { Lobby } from '@openbox/common/src/types/lobbyTypes';
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
): Promise<void> => await wsResponseWrapper(connect, socket, lobbies);

export const wsDisconnect = async (
    lobbies: Lobby[],
    socket: ws.WebSocket,
): Promise<void> => await wsResponseWrapper(disconnect, socket, lobbies);

export const wsMessage = async (
    lobbies: Lobby[],
    socket: ws.WebSocket,
    wsMessage: WebsocketMessage,
): Promise<void> => {
    await wsResponseWrapper(message, socket, lobbies, wsMessage);
};

const wsResponseWrapper = async <FunctionArgs extends Array<unknown>>(
    action: (socket: ws.WebSocket, ...args: FunctionArgs) => Promise<unknown>,
    socket: ws.WebSocket,
    ...args: FunctionArgs
): Promise<void> => {
    try {
        const result = await action(socket, ...args);

        console.log(`SUCCESS`, 200, result);

        socket.send({
            statusCode: 200,
            body: result,
        });
    } catch (error: any) {
        console.log(`ERROR`, error.code ? error.code : 500, error);

        socket.send({
            statusCode: error.code ? error.code : 500,
            body: error,
        });
    }
};
