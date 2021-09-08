import {
    APIError,
    Lobby,
    Player,
    PlayerView,
    PlayerViewResponse,
} from '@openbox/common';

export const getPlayerView = (lobby: Lobby, player: Player): PlayerView => {
    const view = lobby.game?.playerViews.find(
        (view) => view.playerId === player._id,
    );

    if (!view) {
        throw new APIError(404, `player view not found`);
    }

    return view;
};

export const formatPlayerViewResponse = (
    playerView: PlayerView,
): PlayerViewResponse => ({
    playerId: playerView.playerId,
    view: playerView.view,
});
