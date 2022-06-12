import { getLobbyById, updatePlayer } from '../../helpers/lobby';
import { getPlayer, verifyPlayer } from '../../helpers/player';

import { RequestDataLocation } from '@openbox/common';
import { getRequestData } from '../../helpers/requestValidation';

export const connect = async (event: any): Promise<string> => {
    console.log(`CONNECT`, event);

    const { connectionId, lobbyId, playerId, secret } = getRequestData<{
        connectionId: string;
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

    console.log({ connectionId, lobbyId, playerId, secret });

    const lobby = await getLobbyById(lobbyId);
    const player = getPlayer(lobby, playerId);
    player.websocketId = connectionId;

    console.log({ lobby, player });

    verifyPlayer(player, secret);

    await updatePlayer(lobbyId, player);

    return `connected`;
};
