import { Component } from './componentTypes';
import { User } from './userTypes';
import { prop } from '@typegoose/typegoose';

export enum GameVerificationState {
    UNVERIFIED,
    VERIFIED,
    ADMIN,
}
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

export class GamemodeVersion {
    @prop() initialPhaseName: string;
    @prop() initialGameState?: string;

    @prop() phases: Phase[];
}

export class Gamemode {
    @prop() _id?: string;
    @prop() name: string;
    @prop() author: User;

    @prop() latestApprovedVersion?: GamemodeVersion;
    @prop() latestVersion: GamemodeVersion;
}

export class GamemodeResponse {
    _id: string;
    name: string;
}
