import {
    JoinLobbyAPIResponse,
    RequestDataLocation,
} from '@openbox/common/src/types/endpointTypes';
import {
    createLobby,
    formatLobbyResponse,
} from '@openbox/common/src/helpers/lobby';
import {
    createPlayer,
    formatPlayerSecretResponse,
} from '@openbox/common/src/helpers/player';

import { Request } from 'express';
import { getRequestData } from '@openbox/common/src/helpers/requestValidation';

export const postLobby = async (
    request: Request,
): Promise<JoinLobbyAPIResponse> => {
    console.log(`POST /lobby`, request);

    const { playerName } = getRequestData<{
        playerName: string;
        authorization: string;
    }>(request, [
        {
            location: RequestDataLocation.BODY,
            name: `playerName`,
            type: `string`,
            required: true,
            minLength: 3,
            maxLength: 100,
        },
    ]);

    console.log({ playerName });

    const { player, secret } = createPlayer(playerName);
    const lobby = await createLobby(player);

    console.log({ player, secret, lobby });

    return {
        player: formatPlayerSecretResponse(player, secret),
        lobby: await formatLobbyResponse(lobby),
    };
};
