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

    @prop() code: string;
}

export class GamemodeVersion {
    @prop() initialPhaseName: string;
    @prop() initialGameState?: string;

    @prop() sharedCode?: string;
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
    author: User;
}

export class GamemodeDetailsResponse {
    _id: string;
    name: string;
    author: User;

    latestApprovedVersion?: GamemodeVersion;
    latestVersion: GamemodeVersion;
}
