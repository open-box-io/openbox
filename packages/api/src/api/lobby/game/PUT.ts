import {
    getGamemodeId,
    getLobbyId,
    getPlayerId,
    getPlayerSecret,
} from '../../../helpers/requestValidation';
import {
    getLobbyById,
    setLobbyGamemode,
    websocketLobbyUpdate,
} from '../../../helpers/lobby';
import {
    getPlayer,
    verifyPlayer,
    verifyPlayerHost,
} from '../../../helpers/player';

import { Request } from 'express';
import { WebsocketActionType } from '@openbox/common';

export const putLobbyGame = async (request: Request): Promise<void> => {
    console.log(`PUT /lobby/game`);

    const playerId = getPlayerId(request);
    const playerSecret = getPlayerSecret(request);
    const lobbyId = getLobbyId(request);
    const gamemodeId = getGamemodeId(request);

    console.log({ playerId, playerSecret, lobbyId, gamemodeId });

    const lobby = await getLobbyById(lobbyId);
    const player = getPlayer(lobby, playerId);

    console.log({ lobby, player });

    verifyPlayer(player, playerSecret);
    verifyPlayerHost(lobby, player);

    const updatedLobby = await setLobbyGamemode(lobbyId, gamemodeId);

    await websocketLobbyUpdate(updatedLobby, updatedLobby, {
        type: WebsocketActionType.GAME_CHANGED,
    });
};
