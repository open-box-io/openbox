import { RequestDataLocation, WebsocketActionType } from '@openbox/common';
import { getPlayer, verifyPlayer } from '../../helpers/player';

import { getLobbyById } from '../../helpers/lobby';
import { getRequestData } from 'src/helpers/requestValidation';
import { sendToPlayer } from 'src/helpers/websocket';

export const submit = async (event: any): Promise<void> => {
    console.log(WebsocketActionType.GAME_SUBMIT);

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

    await sendToPlayer(lobby.host, event.data);
};
