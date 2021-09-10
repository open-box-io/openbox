import { Player, PlayerResponse } from './playerTypes';

import { prop } from '@typegoose/typegoose';

export class Lobby {
    @prop() _id: string;

    @prop() host: Player;
    @prop() players: Player[];

    @prop() gamemode_id?: string;
}

export class LobbyResponse {
    _id: string;

    host: PlayerResponse;
    players: PlayerResponse[];

    gamemode_id?: string;
}
