import {
    deleteLobby,
    getLobbyByWebsocketId,
    updatePlayer,
} from '../../helpers/lobby';

import { RequestDataLocation } from '../../../../common/src/types/endpointTypes';
import { getPlayerByWebsocketId } from '../../helpers/player';
import { getRequestData } from '../../helpers/requestValidation';

export const disconnect = async (event: any): Promise<string> => {
    console.log(`DISCONNECT`, event);

    const { websocketId } = getRequestData<{
        websocketId: string;
    }>(event, [
        {
            location: RequestDataLocation.WEBSOCKET_CONTEXT,
            name: `connectionId`,
            type: `string`,
            required: true,
        },
    ]);

    console.log({ websocketId });

    const lobby = await getLobbyByWebsocketId(websocketId);
    const player = getPlayerByWebsocketId(lobby, websocketId);

    console.log({ lobby, player });

    player.websocketId = undefined;

    if (lobby.players.filter((p) => !!p.websocketId).length === 0) {
        await deleteLobby(lobby);
    } else {
        await updatePlayer(lobby._id, player);
    }

    return `disconnected`;
};
