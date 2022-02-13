import { RequestDataLocation, WebsocketActionType } from '@openbox/common';
import {
    deleteLobby as deleteLobbyFunction,
    getLobbyById,
} from '../../helpers/lobby';
import {
    getPlayer,
    verifyPlayer,
    verifyPlayerHost,
} from '../../helpers/player';

import { Request } from 'express';
import { getRequestData } from '../../helpers/requestValidation';
import { sendToLobby } from '../../helpers/websocket';

export const deleteLobby = async (request: Request): Promise<void> => {
    console.log(`DELETE /lobby`, request);

    const { playerId, playerSecret, lobbyId } = getRequestData<{
        playerId: string;
        playerSecret: string;
        lobbyId: string;
    }>(request, [
        {
            location: RequestDataLocation.HEADERS,
            name: `playerId`,
            type: `string`,
            required: true,
        },
        {
            location: RequestDataLocation.HEADERS,
            name: `playerSecret`,
            type: `string`,
            required: true,
        },
        {
            location: RequestDataLocation.HEADERS,
            name: `lobbyId`,
            type: `string`,
            required: true,
        },
    ]);

    console.log({ playerId, playerSecret, lobbyId });

    const lobby = await getLobbyById(lobbyId);
    const player = getPlayer(lobby, playerId);

    console.log({ lobby, player });

    verifyPlayer(player, playerSecret);
    verifyPlayerHost(lobby, player);

    await deleteLobbyFunction(lobby);

    sendToLobby(lobby, {
        action: { type: WebsocketActionType.LOBBY_DELETED },
    });
};
