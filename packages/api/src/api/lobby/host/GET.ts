import { LobbyHostAPIResponse } from '@openbox/common';
import { Request } from 'express';
import { formatPlayerResponse } from '../../../helpers/player';
import { getLobbyById } from '../../../helpers/lobby';
import { getLobbyId } from '../../../helpers/requestValidation';

export const getLobbyHost = async (
    request: Request,
): Promise<LobbyHostAPIResponse> => {
    console.log(`GET /lobby/host`);

    const lobbyId = getLobbyId(request);

    console.log({ lobbyId });

    const lobby = await getLobbyById(lobbyId);
    const host = lobby.host;

    console.log({ lobby, host });

    return {
        host: formatPlayerResponse(host),
    };
};
