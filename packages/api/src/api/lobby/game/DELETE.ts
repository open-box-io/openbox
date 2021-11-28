import {
    getLobbyById,
    setLobbyGamemode,
    websocketLobbyUpdate,
} from '../../../helpers/lobby';
import {
    getLobbyId,
    getPlayerId,
    getPlayerSecret,
} from '../../../helpers/requestValidation';
import {
    getPlayer,
    verifyPlayer,
    verifyPlayerHost,
} from '../../../helpers/player';

import { Request } from 'express';
import { WebsocketActionType } from '@openbox/common';

export const deleteLobbyGame = async (request: Request): Promise<void> => {
    console.log(`DELETE /lobby/game`, request);

    const playerId = getPlayerId(request);
    const playerSecret = getPlayerSecret(request);
    const lobbyId = getLobbyId(request);

    console.log({ playerId, playerSecret, lobbyId });

    const lobby = await getLobbyById(lobbyId);
    const player = getPlayer(lobby, playerId);

    console.log({ lobby, player });

    verifyPlayer(player, playerSecret);
    verifyPlayerHost(lobby, player);

    const updatedLobby = await setLobbyGamemode(lobbyId, undefined);

    await websocketLobbyUpdate(updatedLobby, updatedLobby, {
        type: WebsocketActionType.GAME_REMOVED,
    });
};
