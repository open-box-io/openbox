import { prop } from '@typegoose/typegoose';

export class ServerData {
    @prop() _id: string;

    @prop() defaultVolume: number;

    @prop() playList: string[];
}

export const DefaultServerData = (serverId: string): ServerData => ({
    _id: serverId,
    defaultVolume: 100,
    playList: [],
});
