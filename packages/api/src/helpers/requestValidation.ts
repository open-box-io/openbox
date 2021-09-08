import { APIError, Component, getComponent } from '@openbox/common';

import { Request } from 'express';

const nameValidation = (name: string): string => {
    if (!name) {
        throw new APIError(400, `No name provided`);
    }

    if (name.length < 3) {
        throw new APIError(400, `Name must be at least 3 characters`);
    }

    return name;
};

const idValidation = (
    id: string | string[] | undefined,
    message: string,
): string => {
    if (!id) {
        throw new APIError(400, `No ${message} provided`);
    }

    if (typeof id !== `string`) {
        throw new APIError(400, `Invalid ${message}`);
    }

    return id;
};

const componentValidation = (componentsInput: unknown): Component => {
    return getComponent(componentsInput);
};

const arrayValidation = <T>(input: T[], message: string): T[] => {
    if (input.length === undefined || input.length === null) {
        throw new APIError(400, `Invalid ${message}`);
    }

    return input;
};

export const getWebsocketId = (event: any): string => {
    return idValidation(
        event.requestContext.connectionId,
        `websocket connectionId`,
    );
};

export const getPlayerIdWs = (event: any): string => {
    return idValidation(event.queryStringParameters?.playerId, `playerId`);
};

export const getPlayerSecretWs = (event: any): string => {
    return idValidation(event.queryStringParameters?.secret, `secret`);
};

export const getLobbyIdWs = (event: any): string => {
    return idValidation(
        event.queryStringParameters?.lobbyId,
        `lobbyId`,
    ).toUpperCase();
};

export const getPlayerName = (request: Request): string => {
    return nameValidation(request.body?.playerName);
};

export const getPlayerId = (request: Request): string => {
    return idValidation(request.headers?.playerid, `playerId`);
};

export const getPlayerSecret = (request: Request): string => {
    return idValidation(request.headers?.secret, `secret`);
};

export const getLobbyId = (request: Request): string => {
    return idValidation(request.headers?.lobbyid, `lobbyId`).toUpperCase();
};

export const getTargetPlayerId = (request: Request): string => {
    return idValidation(request.body?.playerId, `target playerId`);
};

export const getGamemodeId = (request: Request): string => {
    return idValidation(request.body?.gamemodeId, `gamemodeId`);
};

export const getContext = (request: Request): Component[] => {
    return arrayValidation(request.body?.context, `context`).map((component) =>
        componentValidation(component),
    );
};
