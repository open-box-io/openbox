import { Component } from './componentTypes';
import { prop } from '@typegoose/typegoose';

export class GamemodeScreen {
    components: Component[];
}

export class Phase {
    @prop() phaseName: string;

    @prop() onInitialisation: string;

    @prop() onSubmit: string;
    @prop() onTimeout: string;

    @prop() onPlayerJoined: string;
    @prop() onPlayerLeft: string;
}

export class Gamemode {
    @prop() _id: string;
    @prop() name: string;

    @prop() initialPhaseName: string;
    @prop() initialGameState?: string;

    @prop() phases: Phase[];
}

export class GamemodeResponse {
    _id: string;
    name: string;
}
