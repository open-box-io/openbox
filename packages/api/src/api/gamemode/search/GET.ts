import {
    GamemodeSearchAPIResponse,
    RequestDataLocation,
} from '@openbox/common';
import {
    formatGamemodeResponse,
    getGamemodeById,
    searchGamemode,
} from '../../../helpers/gamemode';

import { Request } from 'express';
import { getRequestData } from '../../../../src/helpers/requestValidation';

export const getSearchGamemode = async (
    request: Request,
): Promise<GamemodeSearchAPIResponse> => {
    console.log(`GET /gamemode/search`, request);

    const { searchText } = getRequestData<{
        searchText: string;
    }>(request, [
        {
            location: RequestDataLocation.HEADERS,
            name: `searchText`,
            type: `string`,
        },
    ]);

    let gamemodes;

    if (searchText) {
        gamemodes = await searchGamemode(searchText);
    } else {
        gamemodes = [await getGamemodeById(`STORY_POINTS`)];
    }

    console.log({ gamemodes });

    return {
        gamemodes: await Promise.all(
            gamemodes.map((gamemode) => formatGamemodeResponse(gamemode)),
        ),
    };
};
