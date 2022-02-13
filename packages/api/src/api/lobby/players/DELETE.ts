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

    const { playerId, playerSecret, lobbyId, targetPlayerId } = getRequestData<{
        playerId: string;
        playerSecret: string;
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
        {
            location: RequestDataLocation.BODY,
            name: `targetPlayerId`,
            type: `string`,
            required: true,
        },
    ]);

    console.log({ playerId, playerSecret, targetPlayerId, lobbyId });

    const lobby = await getLobbyById(lobbyId);
    const player = getPlayer(lobby, playerId);
    const targetPlayer = getPlayer(lobby, targetPlayerId);

    console.log({ lobby, player, targetPlayer });

    verifyPlayer(player, playerSecret);
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
    });

    await disconnectPlayer(targetPlayer);
};
