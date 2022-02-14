import { APIError, RequestDataLocation } from '@openbox/common';
import {
    deleteGamemode as deleteGamemodeFunction,
    getGamemodeById,
} from '../../helpers/gamemode';

import { Request } from 'express';
import { getAuthorizedUserData } from 'src/helpers/auth';
import { getRequestData } from '../../helpers/requestValidation';

export const deleteGamemode = async (request: Request): Promise<void> => {
    console.log(`DELETE /lobby`, request);

    const { authorization, gameId } = getRequestData<{
        authorization: string;
        gameId: string;
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
            name: `gameId`,
            type: `string`,
        },
    ]);

    const user = getAuthorizedUserData(authorization);

    console.log({ user, gameId });

    const gamemode = await getGamemodeById(gameId);

    if (gamemode.author._id === user._id) {
        await deleteGamemodeFunction(gameId);
    } else {
        throw new APIError(
            401,
            `You don't have permission to delete this gamemode`,
        );
    }
};
