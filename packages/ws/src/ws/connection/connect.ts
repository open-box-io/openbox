import { Lobby, LobbyResponse } from '@openbox/common/src/types/lobbyTypes';
import {
    addPlayerToLobby,
    createLobby,
    formatLobbyResponse,
    getLobbyById,
} from '@openbox/common/src/helpers/lobby';
import {
    createPlayer,
    formatPlayerSecretResponse,
} from '@openbox/common/src/helpers/player';

import { PlayerSecretResponse } from '@openbox/common/src/types/playerTypes';
import { RequestDataLocation } from '@openbox/common/src/types/endpointTypes';
import { getRequestData } from '@openbox/common/src/helpers/requestValidation';
import ws from 'ws';

export const connect = async (
    socket: ws.WebSocket,
    lobbies: Lobby[],
): Promise<{
    player: PlayerSecretResponse;
    lobby: LobbyResponse;
}> => {
    console.log(`CONNECT`, socket);

    const { lobbyId, playerName } = getRequestData<{
        lobbyId: string;
        playerName: string;
    }>(socket, [
        {
            location: RequestDataLocation.WEBSOCKET,
            name: `lobbyId`,
            type: `string`,
            required: false,
        },
        {
            location: RequestDataLocation.WEBSOCKET,
            name: `playerName`,
            type: `string`,
            required: true,
        },
    ]);

    console.log({ lobbyId, playerName });

    const { player, secret } = createPlayer(playerName, socket);

    let lobby;

    if (lobbyId) {
        lobby = getLobbyById(lobbies, lobbyId);

        addPlayerToLobby(lobby, player);
    } else {
        lobby = createLobby(lobbies, player);
    }

    return {
        player: formatPlayerSecretResponse(player, secret),
        lobby: formatLobbyResponse(lobby),
    };
};
