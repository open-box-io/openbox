import { APIError, GamemodeDetails, GamemodeResponse } from '@openbox/common';

import { gamemodeDB } from '../database/database';
import { getUserById } from './user';

export const getGamemodeById = async (id: string): Promise<GamemodeDetails> => {
    const gamemode = await gamemodeDB.findById(id);

    if (!gamemode) {
        throw new APIError(404, `Gamemode not found`);
    }

    return gamemode;
};

export const searchGamemode = async (
    text: string,
): Promise<GamemodeDetails[]> => {
    const gamemodes = await gamemodeDB.aggregate([
        {
            $search: {
                index: `searchGamemodeDetails`,
                text: {
                    query: text,
                    path: {
                        wildcard: `*`,
                    },
                },
            },
        },
        // {
        //     $limit: 5,
        // },
    ]);

    if (!gamemodes) {
        throw new APIError(404, `No gamemodes found`);
    }

    return gamemodes;
};

export const createGamemode = async (
    gamemode: GamemodeDetails,
): Promise<GamemodeDetails> => {
    const created = await gamemodeDB.create(gamemode);

    if (!created) {
        throw new APIError(500, `Could not create gamemode`);
    }

    return created;
};

export const updateGamemode = async (
    gamemode: Partial<GamemodeDetails>,
): Promise<GamemodeDetails> => {
    const created = await gamemodeDB.findByIdAndUpdate(gamemode._id, {
        gamemode,
    });

    if (!created) {
        throw new APIError(500, `Could not update gamemode`);
    }

    return created;
};

export const deleteGamemode = async (id: string): Promise<void> => {
    await gamemodeDB.findByIdAndDelete(id);
};

export const formatGamemodeResponse = async (
    gamemode: GamemodeDetails,
): Promise<GamemodeResponse> => {
    const user = await getUserById(gamemode.author);

    return {
        ...gamemode,
        author: user,
        _id: gamemode._id as string,
    };
};
