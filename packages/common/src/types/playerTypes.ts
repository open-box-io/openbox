import { prop } from '@typegoose/typegoose';

export class Player {
    @prop() _id: string;
    @prop() hash: string;
    @prop() name: string;
    @prop() websocketId?: string;
}

export class PlayerResponse {
    _id: string;
    name: string;
}

export class PlayerSecretResponse extends PlayerResponse {
    secret: string;
}
