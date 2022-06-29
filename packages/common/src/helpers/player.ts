import {
    Player,
    PlayerResponse,
    PlayerSecretResponse,
} from '../types/playerTypes';

import { APIError } from '../types/errorTypes';
import Base64 from 'crypto-js/enc-base64';
import { Lobby } from '../types/lobbyTypes';
import crypto from 'crypto';
import sha512 from 'crypto-js/sha512';
import uuid from 'uuid-random';

export const secretToHash = (id: string, secret: string): string => {
    return Base64.stringify(sha512(secret + id));
};

export const createPlayer = (
    playerName: string,
): { player: Player; secret: string } => {
    const id = uuid();
    const secret = crypto.randomBytes(64).toString(`hex`);

    const player: Player = {
        _id: id,
        hash: secretToHash(secret, id),
        name: playerName,
    };

    return { player, secret };
};

export const verifyPlayer = (player: Player, secret: string): void => {
    if (player.hash !== secretToHash(secret, player._id)) {
        throw new APIError(403, `Player secret does not match`);
    }
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

export const getPlayerByWebsocketId = (
    lobby: Lobby,
    websocketId: string,
): Player => {
    const player = lobby.players.find(
        (player: Player) => player.websocketId === websocketId,
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

export const formatPlayerSecretResponse = (
    player: Player,
    secret: string,
): PlayerSecretResponse => ({
    _id: player._id,
    secret: secret,
    name: player.name,
});
