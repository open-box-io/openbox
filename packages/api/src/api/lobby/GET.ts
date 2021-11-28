import { formatLobbyResponse, getLobbyById } from '../../helpers/lobby';

import { LobbyAPIResponse } from '../../../../common/src/types/endpointTypes';
import { Request } from 'express';
import { getLobbyId } from '../../helpers/requestValidation';

export const getLobby = async (request: Request): Promise<LobbyAPIResponse> => {
    console.log(`GET /lobby`, request);

    const lobbyId = getLobbyId(request);

    console.log({ lobbyId });

    const lobby = await getLobbyById(lobbyId);

    console.log({ lobby });

    return {
        lobby: await formatLobbyResponse(lobby),
    };
};
