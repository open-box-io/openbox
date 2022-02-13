import { prop } from '@typegoose/typegoose';

export class User {
    @prop() _id: string;
    @prop() nickname: string;
}
