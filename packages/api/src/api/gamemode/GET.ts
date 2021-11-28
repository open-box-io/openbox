import {
    formatGamemodeResponse,
    getGamemodeById,
} from '../../helpers/gamemode';

import { GamemodeAPIResponse } from '@openbox/common';
import { Request } from 'express';
import { getGamemodeId } from '../../helpers/requestValidation';

export const getGamemode = async (
    request: Request,
): Promise<GamemodeAPIResponse> => {
    console.log(`GET /gamemode`, request);

    const gamemodeId = getGamemodeId(request);

    console.log({ gamemodeId });

    const gamemode = await getGamemodeById(gamemodeId);

    return {
        gamemode: formatGamemodeResponse(gamemode),
    };
};
