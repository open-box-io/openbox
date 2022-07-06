import { APIError } from '../types/errorTypes';
import { Lobby } from '../types/lobbyTypes';

const timeNumbersInGameId = 4;
const randomNumbersInGameId = 1;

export const generateGameCode = (lobbies: Lobby[]): string => {
    const id = (Date.now() % Math.pow(36, timeNumbersInGameId))
        .toString(36)
        .toUpperCase();
    +``
        + Math.floor(Math.random() * Math.pow(36, randomNumbersInGameId))
            .toString(36)
            .toUpperCase();

    const existingLobby = lobbies.filter((l) => l._id === id);

    if (existingLobby) {
        throw new APIError(503, `Server is busy, try again`);
    }

    return id;
};
