import { GamemodeResponse } from './gamemodeTypes';
import { PlayerViewResponse } from './componentTypes';
import { GameResponse } from './gameTypes';
import { PlayerResponse, PlayerSecretResponse } from './playerTypes';
import { LobbyResponse } from './lobbyTypes';

export interface GameAPIResponse {
    playerView: PlayerViewResponse;
}

export interface GamemodeAPIResponse {
    gamemode: GamemodeResponse;
}

export interface LobbyGameAPIResponse {
    game?: GameResponse;
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
