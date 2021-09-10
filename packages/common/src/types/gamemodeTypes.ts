import { Component } from './componentTypes';
import { prop } from '@typegoose/typegoose';

export class GamemodeScreen {
    components: Component[];
}

export class Phase {
    @prop() onInitialisation: string;
    @prop() onSubmit: string;
    @prop() onTimeout: string;
}

export class Gamemode {
    @prop() _id: string;
    @prop() name: string;

    @prop() phases: Phase[];
}

export class GamemodeResponse {
    _id: string;
    name: string;
}
