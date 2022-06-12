import {
    APIError,
    GamemodeDetails,
    RequestDataLocation,
} from '@openbox/common';
import { getGamemodeById, updateGamemode } from '../../helpers/gamemode';

import { Request } from 'express';
import { getAuthorizedUserData } from '../../helpers/auth';
import { getRequestData } from '../../helpers/requestValidation';

export const postGamemode = async (request: Request): Promise<void> => {
    console.log(`POST /gamemode`, request);

    const {
        authorization,
        id,
        name,
        description,
        githubUser,
        githubRepo,
        approvedVersion,
    } = getRequestData<{
        authorization: string;
        id: string;
        name?: string;
        description?: string;
        githubUser?: string;
        githubRepo?: string;
        approvedVersion?: string;
    }>(request, [
        {
            location: RequestDataLocation.HEADERS,
            name: `authorization`,
            type: `string`,
            required: true,
            minLength: 3,
            maxLength: 100,
        },
        {
            location: RequestDataLocation.BODY,
            name: `id`,
            type: `string`,
            required: true,
        },
        {
            location: RequestDataLocation.BODY,
            name: `name`,
            type: `string`,
            minLength: 3,
            maxLength: 100,
        },
        {
            location: RequestDataLocation.BODY,
            name: `description`,
            type: `string`,
        },
        {
            location: RequestDataLocation.BODY,
            name: `githubUser`,
            type: `string`,
        },
        {
            location: RequestDataLocation.BODY,
            name: `githubRepo`,
            type: `string`,
        },
        {
            location: RequestDataLocation.BODY,
            name: `approvedVersion`,
            type: `string`,
        },
    ]);

    const user = getAuthorizedUserData(authorization);

    console.log({
        id,
        user,
        name,
        description,
        githubUser,
        githubRepo,
        approvedVersion,
    });

    const gamemode = await getGamemodeById(id);

    if (gamemode.author !== user._id) {
        throw new APIError(403, `Only the author can edit a gamemode`);
    }

    const gamemodeUpdates: Partial<GamemodeDetails> = {
        _id: id,

        ...(name && { name }),
        ...(description && { description }),
        ...(githubUser && { githubUser }),
        ...(githubRepo && { githubRepo }),
    };

    await updateGamemode(gamemodeUpdates);
};
