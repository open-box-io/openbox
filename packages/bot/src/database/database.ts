import { getModelForClass } from '@typegoose/typegoose';
import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
    await mongoose.connect(
        `mongodb+srv://${process.env.DB_HOST}/${process.env.DB_NAME}`,
        {
            user: process.env.DB_USER,
            pass: process.env.DB_PASS,

            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    );
    mongoose.set(`useFindAndModify`, false);

    const db = mongoose.connection;
};

export const disconnectDB = async (): Promise<void> => {
    await mongoose.disconnect();
};

// export const scrimDB = getModelForClass(Scrim);
