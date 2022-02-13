import { getLobbyById, updatePlayer } from '../../helpers/lobby';
import { getPlayer, verifyPlayer } from '../../helpers/player';

import { RequestDataLocation } from '@openbox/common';
import { getRequestData } from '../../helpers/requestValidation';

export const connect = async (event: any): Promise<string> => {
    console.log(`CONNECT`, event);

    const {
        websocketId,
        lobbyId,
        playerId,
        secret: playerSecret,
    } = getRequestData<{
        websocketId: string;
        lobbyId: string;
        playerId: string;
        secret: string;
    }>(event, [
        {
            location: RequestDataLocation.WEBSOCKET_CONTEXT,
            name: `connectionId`,
            type: `string`,
            required: true,
        },
        {
            location: RequestDataLocation.WEBSOCKET,
            name: `lobbyId`,
            type: `string`,
            required: true,
        },
        {
            location: RequestDataLocation.WEBSOCKET,
            name: `playerId`,
            type: `string`,
            required: true,
        },
        {
            location: RequestDataLocation.WEBSOCKET,
            name: `secret`,
            type: `string`,
            required: true,
        },
    ]);

    console.log({ websocketId, lobbyId, playerId, playerSecret });

    const lobby = await getLobbyById(lobbyId);
    const player = getPlayer(lobby, playerId);
    player.websocketId = websocketId;

    console.log({ lobby, player });

    verifyPlayer(player, playerSecret);

    await updatePlayer(lobbyId, player);

    return `connected`;
};
