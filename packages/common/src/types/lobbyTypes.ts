import { Player, PlayerResponse } from './playerTypes';

export class Lobby {
    _id: string;

    host: Player;
    players: Player[];
}

export class LobbyResponse {
    _id: string;

    host: PlayerResponse;
    players: PlayerResponse[];
}
