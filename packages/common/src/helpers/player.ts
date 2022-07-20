import { Player, PlayerResponse } from '../types/playerTypes';

import { APIError } from '../types/errorTypes';
import { Lobby } from '../types/lobbyTypes';
import uuid from 'uuid-random';
import ws from 'ws';

export const createPlayer = (
    playerName: string,
    websocket: ws.WebSocket,
): { player: Player } => {
    const id = uuid();

    const player: Player = {
        _id: id,
        websocket: websocket,
        name: playerName,
    };

    return { player };
};

export const verifyPlayerHost = (lobby: Lobby, player: Player): void => {
    if (player._id !== lobby.host._id) {
        throw new APIError(403, `Player does not have permission`);
    }
};

export const verifyPlayerNotHost = (lobby: Lobby, player: Player): void => {
    if (player._id === lobby.host._id) {
        throw new APIError(403, `Player is lobby host`);
    }
};

export const getPlayer = (lobby: Lobby, playerId: string): Player => {
    const player = lobby.players.find(
        (player: Player) => player._id === playerId,
    );

    if (!player) {
        throw new APIError(404, `Player not found`);
    }

    return player;
};

export const formatPlayerResponse = (player: Player): PlayerResponse => ({
    _id: player._id,
    name: player.name,
});
