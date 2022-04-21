import { connectDB, disconnectDB } from '../database/database';

import { action } from './action/action';
import { connect } from './connection/connect';
import { disconnect } from './connection/disconnect';
import dotenv from 'dotenv';

dotenv.config();

export const websocket = async (
    event: any,
    context: any,
    callback: (a: null, response: unknown) => Promise<unknown>,
): Promise<void> => {
    switch (event.requestContext.eventType) {
    case `CONNECT`:
        await wsResponseWrapper(event, callback, connect);
        break;
    case `DISCONNECT`:
        await wsResponseWrapper(event, callback, disconnect);
        break;

    default:
        await connectDB();
        await action(event);
        await disconnectDB();
        break;
    }
};

export const wsResponseWrapper = async (
    event: any,
    callback: (a: null, response: unknown) => Promise<unknown>,
    action: (event: unknown) => Promise<unknown>,
): Promise<void> => {
    await connectDB();

    try {
        const result = await action(event);

        console.log(`response success`, 200, JSON.stringify(result));

        callback(null, {
            statusCode: 200,
            body: JSON.stringify(result),
        });
    } catch (error: any) {
        console.log(
            `response error`,
            error.code ? error.code : 500,
            JSON.stringify(error),
        );

        callback(null, {
            statusCode: error.code ? error.code : 500,
            body: JSON.stringify(error),
        });
    }

    await disconnectDB();
};
