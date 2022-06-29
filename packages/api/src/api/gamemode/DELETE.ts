import {
    deleteGamemode as deleteGamemodeFunction,
    getGamemodeById,
} from '@openbox/common/src/helpers/gamemode';

import { APIError } from '@openbox/common/src/types/errorTypes';
import { Request } from 'express';
import { RequestDataLocation } from '@openbox/common/src/types/endpointTypes';
import { getAuthorizedUserData } from '@openbox/common/src/helpers/auth';
import { getRequestData } from '@openbox/common/src/helpers/requestValidation';

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
