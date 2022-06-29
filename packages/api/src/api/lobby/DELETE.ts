import {
    deleteLobby as deleteLobbyFunction,
    getLobbyById,
} from '@openbox/common/src/helpers/lobby';
import {
    formatPlayerResponse,
    getPlayer,
    verifyPlayer,
    verifyPlayerHost,
} from '@openbox/common/src/helpers/player';

import { Request } from 'express';
import { RequestDataLocation } from '@openbox/common/src/types/endpointTypes';
import { WebsocketActionType } from '@openbox/common/src/types/websocketTypes';
import { getRequestData } from '@openbox/common/src/helpers/requestValidation';
import { sendToLobby } from '@openbox/common/src/helpers/websocket';

export const deleteLobby = async (request: Request): Promise<void> => {
    console.log(`DELETE /lobby`, request);

    const { playerId, secret, lobbyId } = getRequestData<{
        playerId: string;
        secret: string;
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
            name: `secret`,
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

    console.log({ playerId, secret, lobbyId });

    const lobby = await getLobbyById(lobbyId);
    const player = getPlayer(lobby, playerId);

    console.log({ lobby, player });

    verifyPlayer(player, secret);
    verifyPlayerHost(lobby, player);

    await deleteLobbyFunction(lobby);

    sendToLobby(lobby, {
        action: {
            type: WebsocketActionType.LOBBY_DELETED,
            sender: formatPlayerResponse(player),
        },
    });
};
