import { Lobby, LobbyResponse } from '../types/lobbyTypes';
import { Player, PlayerResponse } from '../types/playerTypes';
import { WebsocketAction, WebsocketActionType } from '../types/websocketTypes';

import { APIError } from '../types/errorTypes';
import { formatPlayerResponse } from './player';
import { generateGameCode } from '../helpers/gameCode';
import { sendToLobby } from './websocket';
import ws from 'ws';

export const createLobby = (lobbies: Lobby[], player: Player): Lobby => {
    const lobby: Lobby = {
        _id: generateGameCode(lobbies),
        host: player,
        players: [player],
    };

    console.log(`CREATING LOBBY`, { lobby, player });

    lobbies.push(lobby);

    return lobby;
};

export const getLobbyById = (lobbies: Lobby[], id: string): Lobby => {
    const lobby = lobbies.find((l) => l._id === id);

    if (!lobby) {
        throw new APIError(404, `Lobby not found`);
    }

    return lobby;
};

export const getLobbyByWebsocket = (
    lobbyies: Lobby[],
    websocket: ws.WebSocket,
): Lobby => {
    const lobby = lobbyies.find((l) =>
        l.players.find((p) => p.websocket === websocket),
    );

    if (!lobby) {
        throw new APIError(500, `Could not find player`);
    }

    return lobby;
};

export const addPlayerToLobby = (lobby: Lobby, player: Player): void => {
    lobby.players.push(player);

    websocketLobbyUpdate(lobby, lobby, {
        type: WebsocketActionType.PLAYER_JOINED,
        player: formatPlayerResponse(player),
        sender: formatPlayerResponse(player),
    });
};

export const removePlayerFromLobby = (
    lobby: Lobby,
    targetPlayer: Player,
): void => {
    lobby.players = lobby.players.filter(
        (player) => player._id !== targetPlayer._id,
    );

    websocketLobbyUpdate(lobby, lobby, {
        type: WebsocketActionType.PLAYER_LEFT,
        player: formatPlayerResponse(targetPlayer),
        sender: formatPlayerResponse(targetPlayer),
    });
};

// export const promotePlayerToHost = async (
//     lobbyId: string,
//     targetPlayer: Player,
// ): Promise<Lobby> => {
//     const updatedLobby = await lobbyDB.findByIdAndUpdate(lobbyId, {
//         host: targetPlayer,
//     });

//     if (!updatedLobby) {
//         throw new APIError(500, `Could not promote player`);
//     }

//     return updatedLobby;
// };

// export const updatePlayer = async (
//     lobbyId: string,
//     player: Player,
// ): Promise<Lobby> => {
//     let lobby = await lobbyDB.findByIdAndUpdate(lobbyId, {
//         $pull: { players: { _id: player._id } },
//     });

//     if (!lobby) {
//         throw new APIError(500, `Could not update player`);
//     }

//     lobby = await lobbyDB.findByIdAndUpdate(lobbyId, {
//         $push: { players: player },
//     });

//     if (!lobby) {
//         throw new APIError(500, `Could not update player`);
//     }

//     if (!lobby) {
//         throw new APIError(500, `Could not update player`);
//     }

//     return await getLobbyById(lobbyId);
// };

export const formatLobbyResponse = (lobby: Lobby): LobbyResponse => ({
    _id: lobby._id,

    host: formatPlayerResponse(lobby.host),
    players: lobby.players.map(
        (player: Player): PlayerResponse => formatPlayerResponse(player),
    ),
});

export const websocketLobbyUpdate = (
    lobby: Lobby,
    lobbyMessage: Lobby,
    action: WebsocketAction,
): void => {
    sendToLobby(lobby, {
        action: action,
        lobby: formatLobbyResponse(lobbyMessage),
    });
};
