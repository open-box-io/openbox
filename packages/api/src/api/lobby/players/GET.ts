import { LobbyPlayersAPIResponse, Player } from '@openbox/common';

import { Request } from 'express';
import { formatPlayerResponse } from '../../../helpers/player';
import { getLobbyById } from '../../../helpers/lobby';
import { getLobbyId } from '../../../helpers/requestValidation';

export const getLobbyPlayers = async (
    request: Request,
): Promise<LobbyPlayersAPIResponse> => {
    console.log(`GET /lobby/players`, request);

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
