import { GamemodeSearchAPIResponse } from '@openbox/common/src/types/endpointTypes';
import {
    formatGamemodeSearchResponse,
    getGamemodeById,
} from '../../../helpers/gamemode';

import { Request } from 'express';

export const searchGamemode = async (
    request: Request,
): Promise<GamemodeSearchAPIResponse> => {
    console.log(`GET /gamemode/search`, request);

    const gamemode = await getGamemodeById(`TEST_STORY_POINTS`);

    console.log({ gamemode });

    return {
        gamemodes: formatGamemodeSearchResponse([gamemode]),
    };
};
