import {
    formatPlayerResponse,
    getPlayer,
} from '@openbox/common/src/helpers/player';
import {
    sendToLobby,
    sendToPlayer,
} from '@openbox/common/src/helpers/websocket';

import { Lobby } from '@openbox/common/src/types/lobbyTypes';
import { Player } from '@openbox/common/src/types/playerTypes';
import { RequestDataLocation } from '@openbox/common/src/types/endpointTypes';
import { WebsocketMessage } from '@openbox/common/src/types/websocketTypes';
import { getRequestData } from '@openbox/common/src/helpers/requestValidation';
import ws from 'ws';

export const message = async (
    socket: ws.WebSocket,
    player: Player,
    lobby: Lobby,
    message: { message: WebsocketMessage },
): Promise<void> => {
    console.log(`MESSAGE`, { lobby, player, message });

    const { recipientId } = getRequestData<{
        recipientId?: string;
    }>({ message }, [
        {
            location: RequestDataLocation.WEBSOCKET_MESSAGE,
            name: `recipientId`,
            type: `string`,
            required: false,
        },
    ]);

    message.message.action.sender = formatPlayerResponse(player);

    if (recipientId) {
        const recipient = getPlayer(lobby, recipientId);
        console.log(`sending to`, { recipient, message });

        await sendToPlayer(recipient, message.message);
    } else {
        console.log(`sending to`, { players: lobby.players, message });
        await sendToLobby(lobby, message.message);
    }
};
