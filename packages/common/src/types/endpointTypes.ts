import { PlayerResponse, PlayerSecretResponse } from './playerTypes';

import { GamemodeResponse } from './gamemodeTypes';
import { LobbyResponse } from './lobbyTypes';
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
    player: PlayerSecretResponse;
    lobby: LobbyResponse;
}

export enum RequestDataLocation {
    BODY = `body`,
    QUERY = `query`,
    HEADERS = `headers`,
    WEBSOCKET = `queryStringParameters`,
    WEBSOCKET_CONTEXT = `requestContext`,
    WEBSOCKET_BODY = `body`,
}

export interface RequestDataSelector {
    location: RequestDataLocation;
    name: string;
    type: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
}
