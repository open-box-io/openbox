import { GamemodeAPIResponse, RequestDataLocation } from '@openbox/common';
import {
    formatGamemodeResponse,
    getGamemodeById,
} from '../../helpers/gamemode';

import { Request } from 'express';
import { getRequestData } from '../../helpers/requestValidation';

export const getGamemode = async (
    request: Request,
): Promise<GamemodeAPIResponse> => {
    console.log(`GET /gamemode`, request);

    const { id } = getRequestData<{
        id: string;
    }>(request, [
        {
            location: RequestDataLocation.HEADERS,
            name: `id`,
            type: `string`,
            required: true,
        },
    ]);

    console.log({ id });

    const gamemode = await getGamemodeById(id);

    console.log({ gamemode });

    return {
        gamemode: await formatGamemodeResponse(gamemode),
    };
};
