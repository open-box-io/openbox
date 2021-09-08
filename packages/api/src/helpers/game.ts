import { Game, GameResponse, Lobby, WebsocketAction } from '@openbox/common';
import { formatGamemodeResponse, getGamemodeById } from './gamemode';
import { formatPlayerViewResponse, getPlayerView } from './component';

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
