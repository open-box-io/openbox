import {
    formatPlayerViewResponse,
    getPlayerView,
} from '../../helpers/component';
import {
    getLobbyId,
    getPlayerId,
    getPlayerSecret,
} from '../../helpers/requestValidation';
import { getPlayer, verifyPlayer } from '../../helpers/player';

import { GameAPIResponse } from '@openbox/common';
import { Request } from 'express';
import { getLobbyById } from '../../helpers/lobby';

export const getGame = async (request: Request): Promise<GameAPIResponse> => {
    const playerId = getPlayerId(request);
    const playerSecret = getPlayerSecret(request);
    const lobbyId = getLobbyId(request);

    console.log({ playerId, playerSecret, lobbyId });

    const lobby = await getLobbyById(lobbyId);
    const player = getPlayer(lobby, playerId);

    console.log({ lobby, player });

    verifyPlayer(player, playerSecret);

    const playerView = getPlayerView(lobby, player);

    return { playerView: formatPlayerViewResponse(playerView) };
};
