import { getLobbyById } from '@openbox/common/src/helpers/lobby';
import { getPlayer, verifyPlayer, formatPlayerResponse } from '@openbox/common/src/helpers/player';
import { getRequestData } from '@openbox/common/src/helpers/requestValidation';
import { sendToPlayer, sendToLobby } from '@openbox/common/src/helpers/websocket';
import { RequestDataLocation } from '@openbox/common/src/types/endpointTypes';
import { WebsocketMessage } from '@openbox/common/src/types/websocketTypes';


export const action = async (event: any): Promise<void> => {
    event.body = JSON.parse(event.body);
    console.log(`ACTION`, event);

    const { lobbyId, playerId, secret, recipientId, message } = getRequestData<{
        lobbyId: string;
        playerId: string;
        secret: string;
        recipientId?: string;
        message: WebsocketMessage;
    }>(event, [
        {
            location: RequestDataLocation.WEBSOCKET_BODY,
            name: `lobbyId`,
            type: `string`,
            required: true,
        },
        {
            location: RequestDataLocation.WEBSOCKET_BODY,
            name: `playerId`,
            type: `string`,
            required: true,
        },
        {
            location: RequestDataLocation.WEBSOCKET_BODY,
            name: `secret`,
            type: `string`,
            required: true,
        },
        {
            location: RequestDataLocation.WEBSOCKET_BODY,
            name: `recipientId`,
            type: `string`,
            required: false,
        },
        {
            location: RequestDataLocation.WEBSOCKET_BODY,
            name: `message`,
            type: `object`,
            required: true,
        },
    ]);

    console.log({ lobbyId, playerId, secret, recipientId, message });

    const lobby = await getLobbyById(lobbyId);
    const player = getPlayer(lobby, playerId);

    console.log({ lobby, player });

    verifyPlayer(player, secret);

    message.action.sender = formatPlayerResponse(player);

    if (recipientId) {
        const recipient = getPlayer(lobby, recipientId);
        console.log(`sending to`, { recipient, message });

        await sendToPlayer(recipient, message);
    } else {
        console.log(`sending to`, { players: lobby.players, message });
        await sendToLobby(lobby, message);
    }
};
