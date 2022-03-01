import { Player, PlayerResponse } from './playerTypes';

import { GamemodeResponse } from './gamemodeTypes';
import { prop } from '@typegoose/typegoose';

export class Lobby {
    @prop() _id: string;

    @prop() host: Player;
    @prop() players: Player[];

    @prop() gamemodeId?: string;
}

export class LobbyResponse {
    _id: string;

    host: PlayerResponse;
    players: PlayerResponse[];

    gamemode?: GamemodeResponse;
}
