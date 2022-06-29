import {
    LobbyPlayersAPIResponse,
    RequestDataLocation,
} from '@openbox/common/src/types/endpointTypes';

import { Player } from '@openbox/common/src/types/playerTypes';
import { Request } from 'express';
import { formatPlayerResponse } from '@openbox/common/src/helpers/player';
import { getLobbyById } from '@openbox/common/src/helpers/lobby';
import { getRequestData } from '@openbox/common/src/helpers/requestValidation';

export const getLobbyPlayers = async (
    request: Request,
): Promise<LobbyPlayersAPIResponse> => {
    console.log(`GET /lobby/players`, request);

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
        players: lobby.players.map((player: Player) =>
            formatPlayerResponse(player),
        ),
    };
};
