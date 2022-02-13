import { APIError, Gamemode, GamemodeVersion, User } from '@openbox/common';

import { gamemodeDB } from '../database/database';

export const getGamemodeById = async (id: string): Promise<Gamemode> => {
    const gamemode = await gamemodeDB.findById(id);

    if (!gamemode) {
        throw new APIError(404, `Gamemode not found`);
    }

    return gamemode;
};

export const createNewGamemode = async (
    name: string,
    user: User,
    gamemodeVersion: GamemodeVersion,
): Promise<Gamemode> => {
    const gamemode = {
        name: name,
        author: user,
        versions: [gamemodeVersion],
    };

    const created = await gamemodeDB.create(gamemode);

    if (!created) {
        throw new APIError(500, `Could not create gamemode`);
    }

    return created;
};

export const addVersionToGamemode = async (
    gamemodeId: string,
    gamemodeVersion: GamemodeVersion,
): Promise<Gamemode> => {
    const oldGamemode = await gamemodeDB.findOneAndUpdate(
        { _id: gamemodeId },
        { $push: { versions: gamemodeVersion } },
    );

    if (!oldGamemode) {
        throw new APIError(500, `Could not add player`);
    }

    return oldGamemode;
};
