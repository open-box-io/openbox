import {
    APIError,
    Gamemode,
    GamemodeResponse,
} from '@openbox/common';

import { gamemodeDB } from '../database/database';

export const getGamemodeById = async (id: string): Promise<Gamemode> => {
    const gamemode = await gamemodeDB.findById(id);

    if (!gamemode) {
        throw new APIError(404, `Gamemode not found`);
    }

    return gamemode;
};

export const formatGamemodeResponse = (
    gamemode: Gamemode,
): GamemodeResponse => ({
    _id: gamemode._id,
    name: gamemode.name,
});
