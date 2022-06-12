import { APIError, RequestDataLocation } from '@openbox/common';
import {
    deleteGamemode as deleteGamemodeFunction,
    getGamemodeById,
} from '../../helpers/gamemode';

import { Request } from 'express';
import { getAuthorizedUserData } from '../../helpers/auth';
import { getRequestData } from '../../helpers/requestValidation';

export const deleteGamemode = async (request: Request): Promise<void> => {
    console.log(`DELETE /gamemode`, request);

    const { authorization, id } = getRequestData<{
        authorization: string;
        id: string;
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
    ]);

    const user = getAuthorizedUserData(authorization);

    console.log({ user, id });

    const gamemode = await getGamemodeById(id);

    if (gamemode.author !== user._id) {
        throw new APIError(403, `Only the author can delete a gamemode`);
    }

    await deleteGamemodeFunction(id);
};
