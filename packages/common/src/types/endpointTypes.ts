import { PlayerResponse, PlayerSecretResponse } from './playerTypes';

import { GamemodeResponse } from './gamemodeTypes';
import { LobbyResponse } from './lobbyTypes';
import { PlayerViewResponse } from './componentTypes';

export interface GameAPIResponse {
    playerView: PlayerViewResponse;
}

export interface GamemodeAPIResponse {
    gamemode: GamemodeResponse;
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
}

export interface RequestDataSelector {
    location: RequestDataLocation;
    name: string;
    type: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
}
