import {
    JoinLobbyAPIResponse,
    RequestDataLocation,
} from '@openbox/common/src/types/endpointTypes';
import {
    addPlayerToLobby,
    formatLobbyResponse,
    websocketLobbyUpdate,
} from '@openbox/common/src/helpers/lobby';
import {
    createPlayer,
    formatPlayerResponse,
    formatPlayerSecretResponse,
} from '@openbox/common/src/helpers/player';

import { Request } from 'express';
import { WebsocketActionType } from '@openbox/common/src/types/websocketTypes';
import { getRequestData } from '@openbox/common/src/helpers/requestValidation';

export const putLobbyPlayers = async (
    request: Request,
): Promise<JoinLobbyAPIResponse> => {
    console.log(`PUT /lobby/player`, request);

    const { lobbyId, playerName } = getRequestData<{
        lobbyId: string;
        playerName: string;
    }>(request, [
        {
            location: RequestDataLocation.HEADERS,
            name: `lobbyId`,
            type: `string`,
            required: true,
        },
        {
            location: RequestDataLocation.BODY,
            name: `playerName`,
            type: `string`,
            required: true,
        },
    ]);

    console.log({ playerName, lobbyId });

    const { player, secret } = createPlayer(playerName);
    const lobby = await addPlayerToLobby(lobbyId, player);

    console.log({ player, secret, lobby });

    await websocketLobbyUpdate(lobby, lobby, {
        type: WebsocketActionType.PLAYER_JOINED,
        player: formatPlayerResponse(player),
        sender: formatPlayerResponse(player),
    });

    return {
        player: formatPlayerSecretResponse(player, secret),
        lobby: await formatLobbyResponse(lobby),
    };
};
