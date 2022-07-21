import express, { Request, Response } from 'express';

import { APIError } from '@openbox/common/src/types/errorTypes';
import bodyParser from 'body-parser';
import cors from 'cors';
import { postGamemode } from './gamemode/POST';
import { deleteGamemode } from './gamemode/DELETE';
import { getGamemode } from './gamemode/GET';
import { getSearchGamemode } from './gamemode/search/GET';
import { putGamemode } from './gamemode/PUT';
import { connectDB, disconnectDB } from '@openbox/common/src/database/database';

const app = express();

const jsonParser = bodyParser.json();

const corsOptionsDelegate = (req: any, callback: any) => {
    let corsOptions;
    const origin = req.header(`Origin`);
    console.log(`origin`, origin);

    if (origin === `http://localhost:3000` || origin.endsWith(`.open-box.io`)) {
        corsOptions = { origin: true };
        console.log(`cors accepted`);
    } else {
        corsOptions = { origin: false };
        console.log(`cors rejected`);
    }

    callback(null, corsOptions);
};

app.options(`/gamemode`, cors(corsOptionsDelegate));

app.get(
    `/gamemode`,
    cors(corsOptionsDelegate),
    jsonParser,
    (request, response) => {
        apiResponseWrapper(request, response, getGamemode);
    },
);

app.post(
    `/gamemode`,
    cors(corsOptionsDelegate),
    jsonParser,
    (request, response) => {
        apiResponseWrapper(request, response, postGamemode);
    },
);

app.put(
    `/gamemode`,
    cors(corsOptionsDelegate),
    jsonParser,
    (request, response) => {
        apiResponseWrapper(request, response, putGamemode);
    },
);

app.delete(
    `/gamemode`,
    cors(corsOptionsDelegate),
    jsonParser,
    (request, response) => {
        apiResponseWrapper(request, response, deleteGamemode);
    },
);

app.options(`/gamemode/search`, cors(corsOptionsDelegate));

app.get(
    `/gamemode/search`,
    cors(corsOptionsDelegate),
    jsonParser,
    (request, response) => {
        apiResponseWrapper(request, response, getSearchGamemode);
    },
);

export const getAPI = (): express.Express => app;

export const apiResponseWrapper = async (
    request: Request,
    response: Response,
    endpointFunction: (request: Request) => unknown | undefined,
): Promise<void> => {
    try {
        await connectDB();

        const result = (await endpointFunction(request)) || {};

        console.log(`response success`, 200, JSON.stringify(result));

        response.writeHead(200, { 'Content-Type': `application/json` });
        response.write(JSON.stringify(result));
        response.end();
    } catch (error) {
        const APIError = <APIError>error;

        console.log(
            `response error`,
            APIError.code ? APIError.code : 500,
            JSON.stringify(APIError),
        );

        response.writeHead(APIError.code ? APIError.code : 500, {
            'Content-Type': `application/json`,
        });
        response.write(JSON.stringify(APIError));
        response.end();
    } finally {
        await disconnectDB();
    }
};
