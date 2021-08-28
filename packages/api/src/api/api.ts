import { connectDB, disconnectDB } from '../database/database';
import express, { Request, Response } from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';
import { deleteLobby } from './lobby/DELETE';
import { deleteLobbyGame } from './lobby/game/DELETE';
import { deleteLobbyPlayers } from './lobby/players/DELETE';
import { getGame } from './game/GET';
import { getGamemode } from './gamemode/GET';
import { getLobby } from './lobby/GET';
import { getLobbyGame } from './lobby/game/GET';
import { getLobbyHost } from './lobby/host/GET';
import { getLobbyPlayers } from './lobby/players/GET';
import { postGame } from './game/POST';
import { postLobby } from './lobby/POST';
import { putLobbyGame } from './lobby/game/PUT';
import { putLobbyHost } from './lobby/host/PUT';
import { putLobbyPlayers } from './lobby/players/PUT';

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

app.options(`/lobby/game`, cors(corsOptionsDelegate));

app.delete(
    `/lobby/game`,
    cors(corsOptionsDelegate),
    jsonParser,
    (request, response) => {
        apiResponseWrapper(request, response, deleteLobbyGame);
    },
);

app.get(
    `/lobby/game`,
    cors(corsOptionsDelegate),
    jsonParser,
    (request, response) => {
        apiResponseWrapper(request, response, getLobbyGame);
    },
);

app.put(
    `/lobby/game`,
    cors(corsOptionsDelegate),
    jsonParser,
    (request, response) => {
        apiResponseWrapper(request, response, putLobbyGame);
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

app.options(`/game`, cors(corsOptionsDelegate));

app.get(`/game`, cors(corsOptionsDelegate), jsonParser, (request, response) => {
    apiResponseWrapper(request, response, getGame);
});

app.post(
    `/game`,
    cors(corsOptionsDelegate),
    jsonParser,
    (request, response) => {
        apiResponseWrapper(request, response, postGame);
    },
);

app.options(`/lobby/host`, cors(corsOptionsDelegate));

app.get(
    `/lobby/host`,
    cors(corsOptionsDelegate),
    jsonParser,
    (request, response) => {
        apiResponseWrapper(request, response, getLobbyHost);
    },
);

app.put(
    `/lobby/host`,
    cors(corsOptionsDelegate),
    jsonParser,
    (request, response) => {
        apiResponseWrapper(request, response, putLobbyHost);
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
        console.log(
            `response error`,
            error.code ? error.code : 500,
            JSON.stringify(error),
        );

        response.writeHead(error.code ? error.code : 500, {
            'Content-Type': `application/json`,
        });
        response.write(JSON.stringify(error));
        response.end();
    } finally {
        await disconnectDB();
    }
};
