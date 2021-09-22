import {
    getLobbyIdWs,
    getPlayerIdWs,
    getPlayerSecretWs,
    getWebsocketId,
} from '../../helpers/requestValidation';
import { getPlayer, verifyPlayer } from '../../helpers/player';

import { WebsocketActionType } from '@openbox/common';
import { getLobbyById } from '../../helpers/lobby';
import { sendToPlayer } from 'src/helpers/websocket';

export const submit = async (event: any): Promise<void> => {
    console.log(WebsocketActionType.GAME_SUBMIT);

    const websocketId = getWebsocketId(event);

    const lobbyId = getLobbyIdWs(event);
    const playerId = getPlayerIdWs(event);
    const playerSecret = getPlayerSecretWs(event);

    console.log({ websocketId, lobbyId, playerId, playerSecret });

    const lobby = await getLobbyById(lobbyId);
    const player = getPlayer(lobby, playerId);
    player.websocketId = websocketId;

    console.log({ lobby, player });

    verifyPlayer(player, playerSecret);

    await sendToPlayer(lobby.host, event.data);
};
