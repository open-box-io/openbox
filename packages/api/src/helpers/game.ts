import { Game, GameResponse } from '@openbox/common/src/types/gameTypes';
import { formatGamemodeResponse, getGamemodeById } from './gamemode';
import { formatPlayerViewResponse, getPlayerView } from './component';

import { Lobby } from '@openbox/common/src/types/lobbyTypes';
import { WebsocketAction } from '@openbox/common/src/types/websocketTypes';
import { sendToPlayer } from './websocket';

export const websocketGameUpdate = async (
    lobby: Lobby,
    action: WebsocketAction,
): Promise<void> => {
    for (let i = 0; i < lobby.players.length; i++) {
        const player = lobby.players[i];

        await sendToPlayer(player, {
            action: action,
            playerView: await formatPlayerViewResponse(
                getPlayerView(lobby, player),
            ),
        });
    }
};

export const formatGameResponse = async (
    game?: Game,
): Promise<GameResponse | undefined> => {
    if (!game) return undefined;

    return {
        gamemode: formatGamemodeResponse(
            await getGamemodeById(game.gamemode_id),
        ),
    };
};
