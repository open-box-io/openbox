import { getLobbyById, updatePlayer } from '../../helpers/lobby';
import {
    getLobbyIdWs,
    getPlayerIdWs,
    getPlayerSecretWs,
    getWebsocketId,
} from '../../helpers/requestValidation';
import { getPlayer, verifyPlayer } from '../../helpers/player';

export const connect = async (event: any): Promise<string> => {
    console.log(`CONNECT`);

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

    await updatePlayer(lobbyId, player);

    return `connected`;
};
