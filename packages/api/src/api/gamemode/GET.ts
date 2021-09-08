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
    console.log(`GET /gamemode`);

    const gamemodeId = getGamemodeId(request);

    const gamemode = await getGamemodeById(gamemodeId);

    console.log({ gamemodeId });

    return {
        gamemode: formatGamemodeResponse(gamemode),
    };
};
