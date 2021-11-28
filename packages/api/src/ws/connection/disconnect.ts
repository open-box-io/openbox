import { deleteLobby, getLobbyByWebsocketId, updatePlayer } from '../../helpers/lobby';

import { getPlayerByWebsocketId } from '../../helpers/player';
import { getWebsocketId } from '../../helpers/requestValidation';

export const disconnect = async (event: any): Promise<string> => {
    console.log(`DISCONNECT`, event);

    const websocketId = getWebsocketId(event);
    const lobby = await getLobbyByWebsocketId(websocketId)

    console.log({ websocketId, lobby });

    const player = getPlayerByWebsocketId(lobby, websocketId);

    console.log({ player })

    player.websocketId = undefined;

    if (lobby.players.filter(p => !!p.websocketId).length === 0) {
        await deleteLobby(lobby);
    } else {
        await updatePlayer(lobby._id, player);
    }

    return `disconnected`;
};
