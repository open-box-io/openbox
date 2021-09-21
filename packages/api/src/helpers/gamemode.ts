import {
    APIError,
    Component,
    Gamemode,
    GamemodeResponse,
    Lobby,
    PlayerView,
} from '@openbox/common';

import { formatLobbyResponse } from './lobby';
import { gamemodeDB } from '../database/database';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Interpreter = require(`js-interpreter`);

export const getGamemodeById = async (id: string): Promise<Gamemode> => {
    const gamemode = await gamemodeDB.findById(id);

    if (!gamemode) {
        throw new APIError(404, `Gamemode not found`);
    }

    return gamemode;
};

const evaluateOutput = (
    output: string,
): {
    currentState: string;
    playerViews: PlayerView[];
} => {
    const outputObject = JSON.parse(output);

    return {
        currentState: outputObject.currentState as string,
        playerViews: outputObject.playerViews as PlayerView[],
    };
};

export const evaluateState = async (
    lobby: Lobby,
    code: string,
    globalCode?: string,
    currentState?: string,
    playerViews?: PlayerView[],
    context?: Component[],
): Promise<{
    currentState: string;
    playerViews: PlayerView[];
}> => {
    const allCode = `var lobby = ${await formatLobbyResponse(
        lobby,
    )}; var state = ${currentState}; var playerViews = ${
        playerViews || []
    }; var context = ${context};${globalCode || ``};${code || ``}`;

    let interpreter;
    try {
        interpreter = new Interpreter(allCode);
    } catch (e) {
        console.log(`error interpreting code`, e);
        throw new APIError(500, <string>e);
    }

    interpreter.run();

    const result: string = interpreter.value;

    return evaluateOutput(result);
};

export const formatGamemodeResponse = (
    gamemode: Gamemode,
): GamemodeResponse => ({
    _id: gamemode._id,
    name: gamemode.name,
});
