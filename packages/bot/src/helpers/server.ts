import { DefaultServerData, ServerData } from '../types/server';
import { connectDB, serverDB } from '../database/database';

export const getServerById = async (id: string): Promise<ServerData> => {
    await connectDB();

    const lobby = await serverDB.findById(id);

    if (!lobby) {
        const newLobby = DefaultServerData(id);

        await serverDB.create(newLobby);

        return newLobby;
    }

    return lobby;
};

export const updateServerDefaultVolume = async (
    _id: string,
    defaultVolume: number,
): Promise<void> => {
    await connectDB();

    await getServerById(_id);
    await serverDB.findByIdAndUpdate(_id, { defaultVolume });
};

export const likeTrack = async (_id: string, track: string): Promise<void> => {
    await connectDB();

    await getServerById(_id);
    await serverDB.findByIdAndUpdate(_id, { $push: { playList: track } });
};

export const unlikeTrack = async (
    _id: string,
    track: string,
): Promise<void> => {
    await connectDB();

    await getServerById(_id);
    await serverDB.findByIdAndUpdate(_id, { $pull: { playList: track } });
};
