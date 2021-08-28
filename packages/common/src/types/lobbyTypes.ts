import { Game, GameResponse } from './gameTypes';
import { Player, PlayerResponse } from './playerTypes';

import { prop } from '@typegoose/typegoose';

export class Lobby {
    @prop() _id: string;

    @prop() host: Player;
    @prop() players: Player[];

    @prop() game?: Game;
}

export class LobbyResponse {
    _id: string;

    host: PlayerResponse;
    players: PlayerResponse[];

    game?: GameResponse;
}
