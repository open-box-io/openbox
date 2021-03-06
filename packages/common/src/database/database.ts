import { APIError } from '../types/errorTypes';
import { GamemodeDetails } from '../types/gamemodeTypes';
import dotenv from 'dotenv';
import { getModelForClass } from '@typegoose/typegoose';
import mongoose from 'mongoose';

dotenv.config();

export const connectDB = async (): Promise<void> => {
    console.log(`Connecting to MongoDB`);

    await mongoose.connect(`mongodb+srv://${process.env.DB_HOST}/OpenBox-DB`, {
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,

        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    mongoose.set(`useFindAndModify`, false);

    const db = mongoose.connection;
    db.on(`error`, () => {
        console.log(`Could not connect to mongoDB`);
        throw new APIError(500, `Could not connect to mongoDB`);
    });
    db.on(`connected`, () => {
        console.log(`Connected to mongoDB`);
    });
    db.on(`disconnected`, () => {
        console.log(`Disconnected from mongoDB`);
    });
};

export const disconnectDB = async (): Promise<void> => {
    await mongoose.disconnect();
};

export const gamemodeDB = getModelForClass(GamemodeDetails);
