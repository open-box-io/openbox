import {
    formatPlayerResponse,
    getPlayer,
    verifyPlayer,
} from '@openbox/common/src/helpers/player';
import {
    sendToLobby,
    sendToPlayer,
} from '@openbox/common/src/helpers/websocket';

import { Lobby } from '@openbox/common/src/types/lobbyTypes';
import { RequestDataLocation } from '@openbox/common/src/types/endpointTypes';
import { WebsocketMessage } from '@openbox/common/src/types/websocketTypes';
import { getLobbyById } from '@openbox/common/src/helpers/lobby';
import { getRequestData } from '@openbox/common/src/helpers/requestValidation';
import ws from 'ws';

export const message = async (
    socket: ws.WebSocket,
    lobbies: Lobby[],
    message: WebsocketMessage,
): Promise<void> => {
    console.log(`MESSAGE`, socket, message);

    const { lobbyId, playerId, secret, recipientId } = getRequestData<{
        lobbyId: string;
        playerId: string;
        secret: string;
        recipientId?: string;
    }>(socket, [
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
    ]);

    console.log({ lobbyId, playerId, secret, recipientId });

    const lobby = getLobbyById(lobbies, lobbyId);
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
