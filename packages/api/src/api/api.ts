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
import { getGamemode } from './gamemode/GET';
import { searchGamemode } from './gamemode/search/GET';

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
        apiResponseWrapper(request, response, searchGamemode);
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
