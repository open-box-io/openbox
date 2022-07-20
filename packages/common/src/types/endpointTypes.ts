import { GamemodeResponse } from './gamemodeTypes';
import { LobbyResponse } from './lobbyTypes';
import { PlayerResponse } from './playerTypes';
import { PlayerView } from './componentTypes';

export interface GameAPIResponse {
    playerView: PlayerView;
}

export interface GamemodeAPIResponse {
    gamemode: GamemodeResponse;
}

export interface GamemodeSearchAPIResponse {
    gamemodes: GamemodeResponse[];
}
export interface LobbyHostAPIResponse {
    host: PlayerResponse;
}

export interface LobbyPlayersAPIResponse {
    players: PlayerResponse[];
}

export interface LobbyAPIResponse {
    lobby: LobbyResponse;
}

export interface JoinLobbyAPIResponse {
    player: PlayerResponse;
    lobby: LobbyResponse;
}

export enum RequestDataLocation {
    BODY = `body`,
    QUERY = `query`,
    HEADERS = `headers`,
    WEBSOCKET_QUERY = `queryParams`,
    WEBSOCKET_CONTEXT = `requestContext`,
    WEBSOCKET_MESSAGE = `message`,
}

export interface RequestDataSelector {
    location: RequestDataLocation;
    name: string;
    type: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
}
