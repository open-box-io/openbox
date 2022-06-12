import { RequestDataLocation, WebsocketActionType } from '@openbox/common';
import {
    formatPlayerResponse,
    getPlayer,
    verifyPlayer,
    verifyPlayerHost,
    verifyPlayerNotHost,
} from '../../../helpers/player';
import {
    getLobbyById,
    removePlayerFromLobby,
    websocketLobbyUpdate,
} from '../../../helpers/lobby';

import { Request } from 'express';
import { disconnectPlayer } from '../../../helpers/websocket';
import { getRequestData } from '../../../helpers/requestValidation';

export const deleteLobbyPlayers = async (request: Request): Promise<void> => {
    console.log(`DELETE /lobby/players`, request);

    const { playerId, secret, lobbyId, targetPlayerId } = getRequestData<{
        playerId: string;
        secret: string;
        lobbyId: string;
        targetPlayerId: string;
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
        {
            location: RequestDataLocation.BODY,
            name: `targetPlayerId`,
            type: `string`,
            required: true,
        },
    ]);

    console.log({ playerId, secret, targetPlayerId, lobbyId });

    const lobby = await getLobbyById(lobbyId);
    const player = getPlayer(lobby, playerId);
    const targetPlayer = getPlayer(lobby, targetPlayerId);

    console.log({ lobby, player, targetPlayer });

    verifyPlayer(player, secret);
    if (player._id !== targetPlayer._id) {
        verifyPlayerHost(lobby, player);
    }
    verifyPlayerNotHost(lobby, targetPlayer);

    await removePlayerFromLobby(lobbyId, targetPlayer);
    const updatedLobby = await getLobbyById(lobbyId);

    console.log({ updatedLobby });

    const actionType
        = player._id === targetPlayer._id ?
            WebsocketActionType.PLAYER_LEFT
            : WebsocketActionType.PLAYER_REMOVED;
    await websocketLobbyUpdate(lobby, updatedLobby, {
        type: actionType,
        player: formatPlayerResponse(targetPlayer),
        sender: formatPlayerResponse(player),
    });

    await disconnectPlayer(targetPlayer);
};
