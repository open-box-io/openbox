import { connectDB, disconnectDB } from '../database/database';
import express, { Request, Response } from 'express';

import { APIError } from '@openbox/common';
import bodyParser from 'body-parser';
import cors from 'cors';
import { deleteLobby } from './lobby/DELETE';
import { deleteLobbyPlayers } from './lobby/players/DELETE';
import { getLobby } from './lobby/GET';
import { getLobbyPlayers } from './lobby/players/GET';
import { postLobby } from './lobby/POST';
import { putLobbyPlayers } from './lobby/players/PUT';
import { postGamemode } from './gamemode/POST';
import { deleteGamemode } from './gamemode/DELETE';

const app = express();

const jsonParser = bodyParser.json();

const allowlist = [
    `https://www.open-box.io`,
    `http://localhost:3001`,
    `http://localhost:3000`,
];

const corsOptionsDelegate = (req: any, callback: any) => {
    let corsOptions;
    console.log(`origin`, req.header(`Origin`));
    if (allowlist.indexOf(req.header(`Origin`)) !== -1) {
        corsOptions = { origin: true };
        console.log(`cors accepted`);
    } else {
        corsOptions = { origin: false };
        console.log(`cors rejected`);
    }
    callback(null, corsOptions);
};

app.options(`/lobby`, cors(corsOptionsDelegate));

app.delete(
    `/lobby`,
    cors(corsOptionsDelegate),
    jsonParser,
    (request, response) => {
        apiResponseWrapper(request, response, deleteLobby);
    },
);

app.get(
    `/lobby`,
    cors(corsOptionsDelegate),
    jsonParser,
    (request, response) => {
        apiResponseWrapper(request, response, getLobby);
    },
);

app.post(
    `/lobby`,
    cors(corsOptionsDelegate),
    jsonParser,
    (request, response) => {
        apiResponseWrapper(request, response, postLobby);
    },
);

app.options(`/lobby/players`, cors(corsOptionsDelegate));

app.delete(
    `/lobby/players`,
    cors(corsOptionsDelegate),
    jsonParser,
    (request, response) => {
        apiResponseWrapper(request, response, deleteLobbyPlayers);
    },
);

app.get(
    `/lobby/players`,
    cors(corsOptionsDelegate),
    jsonParser,
    (request, response) => {
        apiResponseWrapper(request, response, getLobbyPlayers);
    },
);

app.put(
    `/lobby/players`,
    cors(corsOptionsDelegate),
    jsonParser,
    (request, response) => {
        apiResponseWrapper(request, response, putLobbyPlayers);
    },
);

app.options(`/gamemode`, cors(corsOptionsDelegate));

app.post(
    `/gamemode`,
    cors(corsOptionsDelegate),
    jsonParser,
    (request, response) => {
        apiResponseWrapper(request, response, postGamemode);
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

export const getAPI = (): unknown => app;

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
