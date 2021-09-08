import { APIError, GameAPIResponse } from '@openbox/common';
import {
    formatPlayerViewResponse,
    getPlayerView,
} from '../../helpers/component';
import {
    getContext,
    getLobbyId,
    getPlayerId,
    getPlayerSecret,
} from '../../helpers/requestValidation';
import { getGamemodeById, submitAction } from '../../helpers/gamemode';
import { getLobbyById, updateLobbyGameState } from '../../helpers/lobby';
import { getPlayer, verifyPlayer } from '../../helpers/player';

import { Request } from 'express';

export const postGame = async (request: Request): Promise<GameAPIResponse> => {
    const playerId = getPlayerId(request);
    const playerSecret = getPlayerSecret(request);
    const lobbyId = getLobbyId(request);
    const context = getContext(request);

    console.log({ playerId, playerSecret, lobbyId, context });

    const lobby = await getLobbyById(lobbyId);
    const player = getPlayer(lobby, playerId);

    console.log({ lobby, player });

    if (!lobby.game?.gamemode_id) {
        throw new APIError(409, `Lobby does not have a game`);
    }
    verifyPlayer(player, playerSecret);

    const gamemode = await getGamemodeById(lobby.game.gamemode_id);

    console.log({ gamemode });

    const nextState = await submitAction(gamemode, lobby, context);
    const updatedLobby = await updateLobbyGameState(lobby, nextState);

    console.log({ nextState, updatedLobby });

    const playerView = getPlayerView(updatedLobby, player);

    return { playerView: formatPlayerViewResponse(playerView) };
};
