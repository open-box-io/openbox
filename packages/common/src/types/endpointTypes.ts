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
