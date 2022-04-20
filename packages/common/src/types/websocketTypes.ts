import { LobbyResponse } from './lobbyTypes';
import { PlayerResponse } from './playerTypes';
import { PlayerView } from './componentTypes';

export enum WebsocketActionType {
    LOBBY_CREATED = `LOBBY_CREATED`,
    LOBBY_DELETED = `LOBBY_DELETED`,

    GAME_REMOVED = `GAME_REMOVED`,
    GAME_CHANGED = `GAME_CHANGED`,

    PLAYER_LEFT = `PLAYER_LEFT`,
    PLAYER_REMOVED = `PLAYER_REMOVED`,
    PLAYER_JOINED = `PLAYER_JOINED`,

    HOST_CHANGED = `HOST_PROMOTION`,

    GAME_SUBMIT = `GAME_SUBMIT`,
    GAME_REQUEST = `GAME_REQUEST`,

    PLAYER_VIEW = `PLAYER_VIEW`,
    PLAYER_VIEW_REQUEST = `PLAYER_VIEW_REQUEST`,
}

export class WebsocketAction {
    type: WebsocketActionType;
    sender: PlayerResponse;
    player?: PlayerResponse;
}

export class WebsocketMessage {
    action: WebsocketAction;
    lobby?: LobbyResponse;
    playerView?: PlayerView;
}
