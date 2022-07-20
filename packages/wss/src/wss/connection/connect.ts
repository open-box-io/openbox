import { Lobby, LobbyResponse } from '@openbox/common/src/types/lobbyTypes';
import { Player, PlayerResponse } from '@openbox/common/src/types/playerTypes';
import {
    addPlayerToLobby,
    createLobby,
    formatLobbyResponse,
    getLobbyById,
} from '@openbox/common/src/helpers/lobby';
import {
    createPlayer,
    formatPlayerResponse,
} from '@openbox/common/src/helpers/player';

import { RequestDataLocation } from '@openbox/common/src/types/endpointTypes';
import { getQueryParamaters } from '@openbox/common/src/helpers/websocket';
import { getRequestData } from '@openbox/common/src/helpers/requestValidation';
import ws from 'ws';

export const connect = async (
    socket: ws.WebSocket,
    lobbies: Lobby[],
    request: any,
): Promise<{
    response: {
        player: PlayerResponse;
        lobby: LobbyResponse;
    };
    player: Player;
    lobby: Lobby;
}> => {
    const url = request.url;
    console.log(`CONNECT`, { url });

    const queryParams = getQueryParamaters(url);

    console.log({ queryParams });

    const { lobbyId, playerName } = getRequestData<{
        lobbyId: string;
        playerName: string;
    }>({ queryParams }, [
        {
            location: RequestDataLocation.WEBSOCKET_QUERY,
            name: `lobbyId`,
            type: `string`,
            required: false,
        },
        {
            location: RequestDataLocation.WEBSOCKET_QUERY,
            name: `playerName`,
            type: `string`,
            required: true,
        },
    ]);

    console.log({ lobbyId, playerName });

    const { player } = createPlayer(playerName, socket);

    let lobby;

    if (lobbyId) {
        lobby = getLobbyById(lobbies, lobbyId);

        addPlayerToLobby(lobby, player);
    } else {
        lobby = createLobby(lobbies, player);
    }

    return {
        response: {
            player: formatPlayerResponse(player),
            lobby: formatLobbyResponse(lobby),
        },
        player,
        lobby,
    };
};
