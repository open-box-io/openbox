import {
    APIError,
    Game,
    Lobby,
    LobbyResponse,
    Player,
    PlayerResponse,
    PlayerView,
    WebsocketAction,
} from '@openbox/common';

import { formatGameResponse } from './game';
import { formatPlayerResponse } from './player';
import { generateGameCode } from '../helpers/gameCode';
import { lobbyDB } from '../database/database';
import { sendToLobby } from './websocket';

export const createLobby = async (player: Player): Promise<Lobby> => {
    const lobby: Lobby = {
        _id: await generateGameCode(),
        host: player,
        players: [player],
    };

    const created = await lobbyDB.create(lobby);

    if (!created) {
        throw new APIError(500, `Could not create lobby`);
    }

    return lobby;
};

export const getLobbyById = async (id: string): Promise<Lobby> => {
    const lobby = await lobbyDB.findById(id);

    if (!lobby) {
        throw new APIError(404, `Lobby not found`);
    }

    return lobby;
};

export const deleteLobby = async (lobby: Lobby): Promise<void> => {
    await lobbyDB.deleteOne({ _id: lobby._id });
};

export const addPlayerToLobby = async (
    lobbyId: string,
    player: Player,
): Promise<Lobby> => {
    const oldLobby = await lobbyDB.findOneAndUpdate(
        { _id: lobbyId },
        { $push: { players: player } },
    );

    if (!oldLobby) {
        throw new APIError(500, `Could not add player`);
    }

    const updatedLobby = getLobbyById(lobbyId);

    return updatedLobby;
};

export const removePlayerFromLobby = async (
    lobbyId: string,
    targetPlayer: Player,
): Promise<Lobby> => {
    const updatedLobby = await lobbyDB.findOneAndUpdate(
        { _id: lobbyId },
        { $pull: { players: { _id: targetPlayer._id } } },
    );

    if (!updatedLobby) {
        throw new APIError(500, `Could not remove player`);
    }

    return updatedLobby;
};

export const promotePlayerToHost = async (
    lobbyId: string,
    targetPlayer: Player,
): Promise<Lobby> => {
    const updatedLobby = await lobbyDB.findOneAndUpdate(
        { _id: lobbyId },
        { host: targetPlayer },
    );

    if (!updatedLobby) {
        throw new APIError(500, `Could not promote player`);
    }

    return updatedLobby;
};

export const setLobbyGame = async (
    lobbyId: string,
    game?: Game,
): Promise<Lobby> => {
    const lobby = await lobbyDB.findOneAndUpdate(
        { _id: lobbyId },
        { game: game },
    );

    if (!lobby) {
        throw new APIError(500, `Could not set game`);
    }

    return await getLobbyById(lobbyId);
};

export const updateLobbyGameState = async (
    lobby: Lobby,
    newState: {
        currentState: string;
        playerViews: PlayerView[];
    },
): Promise<Lobby> => {
    if (!lobby.game) {
        throw new APIError(500, `No game found`);
    }

    const game = lobby.game;

    game.currentState = newState.currentState;
    game.playerViews = game.playerViews.filter((view) =>
        newState.playerViews.some(
            (newView) => newView.playerId === view.playerId,
        ),
    );
    game.playerViews = game.playerViews.concat(newState.playerViews);

    const updatedLobby = await lobbyDB.findOneAndUpdate(
        { _id: lobby._id },
        { game: game },
    );

    if (!updatedLobby) {
        throw new APIError(500, `Could not update game`);
    }

    return updatedLobby;
};

export const updatePlayer = async (
    lobbyId: string,
    player: Player,
): Promise<Lobby> => {
    let lobby = await lobbyDB.findOneAndUpdate(
        { _id: lobbyId },
        { $pull: { players: { _id: player._id } } },
    );

    if (!lobby) {
        throw new APIError(500, `Could not update player`);
    }

    lobby = await lobbyDB.findOneAndUpdate(
        { _id: lobbyId },
        { $push: { players: player } },
    );

    if (!lobby) {
        throw new APIError(500, `Could not update player`);
    }

    if (!lobby) {
        throw new APIError(500, `Could not update player`);
    }

    return await getLobbyById(lobbyId);
};

export const formatLobbyResponse = async (
    lobby: Lobby,
): Promise<LobbyResponse> => ({
    _id: lobby._id,

    host: formatPlayerResponse(lobby.host),
    players: lobby.players.map(
        (player: Player): PlayerResponse => formatPlayerResponse(player),
    ),

    game: await formatGameResponse(lobby.game),
});

export const websocketLobbyUpdate = async (
    lobby: Lobby,
    lobbyMessage: Lobby,
    action: WebsocketAction,
): Promise<void> => {
    await sendToLobby(lobby, {
        action: action,
        lobby: await formatLobbyResponse(lobbyMessage),
    });
};
