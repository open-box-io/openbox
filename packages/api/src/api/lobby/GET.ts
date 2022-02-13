import {
    LobbyAPIResponse,
    RequestDataLocation,
} from '../../../../common/src/types/endpointTypes';
import { formatLobbyResponse, getLobbyById } from '../../helpers/lobby';

import { Request } from 'express';
import { getRequestData } from '../../helpers/requestValidation';

export const getLobby = async (request: Request): Promise<LobbyAPIResponse> => {
    console.log(`GET /lobby`, request);

    const { lobbyId } = getRequestData<{
        lobbyId: string;
    }>(request, [
        {
            location: RequestDataLocation.HEADERS,
            name: `lobbyId`,
            type: `string`,
            required: true,
        },
    ]);

    console.log({ lobbyId });

    const lobby = await getLobbyById(lobbyId);

    console.log({ lobby });

    return {
        lobby: await formatLobbyResponse(lobby),
    };
};
