import { LobbyPlayersAPIResponse } from '@openbox/common/src/types/endpointTypes';
import { Player } from '@openbox/common/src/types/playerTypes';
import { Request } from 'express';
import { formatPlayerResponse } from '../../../helpers/player';
import { getLobbyById } from '../../../helpers/lobby';
import { getLobbyId } from '../../../helpers/requestValidation';

export const getLobbyPlayers = async (
    request: Request,
): Promise<LobbyPlayersAPIResponse> => {
    console.log(`GET /lobby/players`);

    const lobbyId = getLobbyId(request);

    console.log({ lobbyId });

    const lobby = await getLobbyById(lobbyId);

    console.log({ lobby });

    return {
        players: lobby.players.map((player: Player) =>
            formatPlayerResponse(player),
        ),
    };
};
