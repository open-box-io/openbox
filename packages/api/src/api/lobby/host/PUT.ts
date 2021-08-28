import {
    formatPlayerResponse,
    getPlayer,
    verifyPlayer,
    verifyPlayerHost,
    verifyPlayerNotHost,
} from '../../../helpers/player';
import {
    getLobbyById,
    promotePlayerToHost,
    websocketLobbyUpdate,
} from '../../../helpers/lobby';
import {
    getLobbyId,
    getPlayerId,
    getPlayerSecret,
    getTargetPlayerId,
} from '../../../helpers/requestValidation';

import { Request } from 'express';
import { WebsocketActionType } from '@openbox/common/src/types/websocketTypes';

export const putLobbyHost = async (request: Request): Promise<void> => {
    console.log(`PUT /lobby/player`);

    const playerId = getPlayerId(request);
    const playerSecret = getPlayerSecret(request);
    const targetPlayerId = getTargetPlayerId(request);
    const lobbyId = getLobbyId(request);

    console.log({ playerId, playerSecret, targetPlayerId, lobbyId });

    const lobby = await getLobbyById(lobbyId);
    const player = getPlayer(lobby, playerId);
    const targetPlayer = getPlayer(lobby, targetPlayerId);

    console.log({ lobby, player, targetPlayer });

    verifyPlayer(player, playerSecret);
    verifyPlayerHost(lobby, player);
    verifyPlayerNotHost(lobby, targetPlayer);

    promotePlayerToHost(lobby._id, targetPlayer);

    await websocketLobbyUpdate(lobby, lobby, {
        type: WebsocketActionType.HOST_CHANGED,
        player: formatPlayerResponse(targetPlayer),
    });
};
