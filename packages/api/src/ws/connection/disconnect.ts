import { getLobbyById, updatePlayer } from '../../helpers/lobby';
import {
    getLobbyIdWs,
    getPlayerIdWs,
    getPlayerSecretWs,
} from '../../helpers/requestValidation';
import { getPlayer, verifyPlayer } from '../../helpers/player';

export const disconnect = async (event: any): Promise<string> => {
    console.log(`DISCONNECT`);

    const lobbyId = getLobbyIdWs(event);
    const playerId = getPlayerIdWs(event);
    const playerSecret = getPlayerSecretWs(event);

    console.log({ lobbyId, playerId, playerSecret });

    const lobby = await getLobbyById(lobbyId);
    const player = getPlayer(lobby, playerId);
    player.websocketId = undefined;

    console.log({ lobby, player });

    verifyPlayer(player, playerSecret);

    await updatePlayer(lobbyId, player);

    return `connected`;
};
