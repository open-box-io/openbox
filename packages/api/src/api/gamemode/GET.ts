import {
    GamemodeAPIResponse,
    RequestDataLocation,
} from '@openbox/common/src/types/endpointTypes';
import {
    formatGamemodeResponse,
    getGamemodeById,
} from '@openbox/common/src/helpers/gamemode';

import { Request } from 'express';
import { getRequestData } from '@openbox/common/src/helpers/requestValidation';

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
