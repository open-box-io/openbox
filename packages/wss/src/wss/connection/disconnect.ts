import {
    deleteLobby,
    removePlayerFromLobby,
} from '@openbox/common/src/helpers/lobby';

import { Lobby } from '@openbox/common/src/types/lobbyTypes';
import { Player } from '@openbox/common/src/types/playerTypes';
import ws from 'ws';

export const disconnect = async (
    socket: ws.WebSocket,
    lobbies: Lobby[],
    player: Player,
    lobby: Lobby,
): Promise<{ status: `disconnected` }> => {
    console.log(`DISCONNECT`, { player });

    removePlayerFromLobby(lobby, player);

    if (lobby.players.length === 0) {
        deleteLobby(lobbies, lobby._id);
    }

    return { status: `disconnected` };
};
