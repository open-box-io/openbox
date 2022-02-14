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
    const gamemode: Gamemode = {
        name: name,
        author: user,
        latestVersion: gamemodeVersion,
    };

    const created = await gamemodeDB.create(gamemode);

    if (!created) {
        throw new APIError(500, `Could not create gamemode`);
    }

    return created;
};

export const updateGamemodeLatestVersion = async (
    gamemodeId: string,
    gamemodeVersion: GamemodeVersion,
): Promise<Gamemode> => {
    const oldGamemode = await gamemodeDB.findByIdAndUpdate(gamemodeId, {
        $push: { versions: gamemodeVersion },
    });

    if (!oldGamemode) {
        throw new APIError(500, `Could not update gamemode`);
    }

    return oldGamemode;
};

export const deleteGamemode = async (id: string): Promise<void> => {
    await gamemodeDB.findByIdAndDelete(id);
};
