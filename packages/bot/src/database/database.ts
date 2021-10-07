import { ServerData } from '../types/server';
import { getModelForClass } from '@typegoose/typegoose';
import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
    await mongoose.connect(`mongodb+srv://${process.env.DB_HOST}/OpenBot-DB`, {
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,

        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    mongoose.set(`useFindAndModify`, false);

    const db = mongoose.connection;

    db.on(`error`, (e) => {
        console.log(`Could not connect to MongoDB`, e);
    });
    db.once(`open`, () => {
        console.log(`Connected to MongoDB`);
    });
};

export const disconnectDB = async (): Promise<void> => {
    await mongoose.disconnect();
};

export const serverDB = getModelForClass(ServerData);
