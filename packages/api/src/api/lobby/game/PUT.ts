import { getGamemodeById, getInitialState } from '../../../helpers/gamemode';
import {
    getGamemodeId,
    getLobbyId,
    getPlayerId,
    getPlayerSecret,
} from '../../../helpers/requestValidation';
import {
    getLobbyById,
    setLobbyGame,
    websocketLobbyUpdate,
} from '../../../helpers/lobby';
import {
    getPlayer,
    verifyPlayer,
    verifyPlayerHost,
} from '../../../helpers/player';

import { Game } from '@openbox/common/src/types/gameTypes';
import { Request } from 'express';
import { WebsocketActionType } from '@openbox/common/src/types/websocketTypes';

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

    const gamemode = await getGamemodeById(gamemodeId);

    console.log({ gamemode });

    const initialState = await getInitialState(gamemode, lobby);

    console.log({ initialState });

    const game: Game = {
        gamemode_id: gamemodeId,
        currentState: initialState.currentState,
        playerViews: initialState.playerViews,
    };

    const updatedLobby = await setLobbyGame(lobbyId, game);

    await websocketLobbyUpdate(updatedLobby, updatedLobby, {
        type: WebsocketActionType.GAME_CHANGED,
    });
};
