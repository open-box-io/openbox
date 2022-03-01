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

    const { gamemodeId } = getRequestData<{
        gamemodeId: string;
    }>(request, [
        {
            location: RequestDataLocation.HEADERS,
            name: `gamemodeId`,
            type: `string`,
            required: true,
        },
    ]);

    console.log({ gamemodeId });

    const gamemode = await getGamemodeById(gamemodeId);

    console.log({ gamemode });

    return {
        gamemode: formatGamemodeResponse(gamemode),
    };
};
