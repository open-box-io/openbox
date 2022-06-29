import { APIError } from '../types/errorTypes';
import { lobbyDB } from '../database/database';

const timeNumbersInGameId = 4;
const randomNumbersInGameId = 1;

export const generateGameCode = async (): Promise<string> => {
    const id = (Date.now() % Math.pow(36, timeNumbersInGameId))
        .toString(36)
        .toUpperCase();
    +``
        + Math.floor(Math.random() * Math.pow(36, randomNumbersInGameId))
            .toString(36)
            .toUpperCase();

    const existingLobby = await lobbyDB.findById(id);

    if (existingLobby) {
        throw new APIError(503, `Server is busy, try again`);
    }

    return id;
};
