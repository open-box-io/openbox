import { Lobby } from '@openbox/common/src/types/lobbyTypes';
import { Player } from '@openbox/common/src/types/playerTypes';
import { removePlayerFromLobby } from '@openbox/common/src/helpers/lobby';

export const disconnect = async (
    player: Player,
    lobby: Lobby,
): Promise<{ status: `disconnected` }> => {
    console.log(`DISCONNECT`, { lobby, player });

    removePlayerFromLobby(lobby, player);

    return { status: `disconnected` };
};
