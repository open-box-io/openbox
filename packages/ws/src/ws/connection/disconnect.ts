import {
    deleteLobby,
    getLobbyByWebsocket,
    removePlayerFromLobbyByWebsocket,
} from '@openbox/common/src/helpers/lobby';

import { Lobby } from '@openbox/common/src/types/lobbyTypes';
import ws from 'ws';

export const disconnect = async (
    socket: ws.WebSocket,
    lobbies: Lobby[],
): Promise<{ status: `disconnected` }> => {
    console.log(`DISCONNECT`, socket);

    const lobby = getLobbyByWebsocket(lobbies, socket);

    removePlayerFromLobbyByWebsocket(lobby, socket);

    if (lobby.players.length === 0) {
        deleteLobby(lobbies, lobby._id);
    }

    return { status: `disconnected` };
};
