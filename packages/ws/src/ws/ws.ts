
import { action } from './action/action';
import { connect } from './connection/connect';
import { disconnect } from './connection/disconnect';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '@openbox/common/src/database/database';

dotenv.config();

export const wsConnect = async (
    event: any,
    _context: never,
    callback: (a: null, response: unknown) => Promise<unknown>,
): Promise<void> => await wsResponseWrapper(event, callback, connect);

export const wsDisconnect = async (
    event: any,
    _context: never,
    callback: (a: null, response: unknown) => Promise<unknown>,
): Promise<void> => await wsResponseWrapper(event, callback, disconnect);

export const wsEvent = async (event: any, _context: never): Promise<void> => {
    await connectDB();
    await action(event);
    await disconnectDB();
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
