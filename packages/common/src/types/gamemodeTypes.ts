import { prop } from '@typegoose/typegoose';
import { Component } from './componentTypes';

export class GamemodeScreen {
    components: Component[];
}

export class GamemodeCalculateState {
    @prop() sharedFunctions: string;
    @prop() initialState: string;
}

export class Gamemode {
    @prop() _id: string;
    @prop() name: string;

    @prop() calculateState: GamemodeCalculateState;
}

export class GamemodeResponse {
    _id: string;
    name: string;
}
