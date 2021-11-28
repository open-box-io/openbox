import { formatGamemodeResponse, getGamemodeById } from '../../../helpers/gamemode';

import { GamemodeAPIResponse } from '@openbox/common';
import { Request } from 'express';
import { getLobbyById } from '../../../helpers/lobby';
import { getLobbyId } from '../../../helpers/requestValidation';

export const getLobbyGame = async (
    request: Request,
): Promise<GamemodeAPIResponse> => {
    console.log(`GET /lobby/game`, request);

    const lobbyId = getLobbyId(request);

    console.log({ lobbyId });

    const lobby = await getLobbyById(lobbyId);

    console.log({ lobby });

    const gamemode = await getGamemodeById(lobby.gamemodeId || ``);

    console.log({ gamemode });

    return {
        gamemode: formatGamemodeResponse(gamemode),
    };
};
