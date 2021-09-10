import { GamemodeResponse } from './gamemodeTypes';
import { prop } from '@typegoose/typegoose';

export class Game {
    @prop() gamemode_id: string;
}

export class GameResponse {
    gamemode: GamemodeResponse;
}
