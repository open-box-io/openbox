import { GamemodeResponse } from './gamemodeTypes';
import { PlayerView } from './componentTypes';
import { prop } from '@typegoose/typegoose';

export class Game {
    @prop() gamemode_id: string;
    @prop() currentState: string;
    @prop() playerViews: PlayerView[];
}

export class GameResponse {
    gamemode: GamemodeResponse;
}
