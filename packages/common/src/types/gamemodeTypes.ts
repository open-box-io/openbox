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
    phaseName: string;

    code: string;
}

export class GamemodeVersion {
    initialPhaseName: string;
    initialGameState?: string;

    sharedCode?: string;
    phases: Phase[];
}

export class Gamemode {
    details: GamemodeDetails;

    gamemode: GamemodeVersion;
}

export class GamemodeDetails {
    @prop() _id?: string;

    @prop() name: string;
    @prop() description: string;
    @prop() author: string;

    @prop() githubUser: string;
    @prop() githubRepo: string;

    @prop() approvedVersion?: string;
}

export class GamemodeResponse {
    _id: string;
    name: string;
    description: string;
    author: User;

    githubUser: string;
    githubRepo: string;

    approvedVersion?: string;
}
