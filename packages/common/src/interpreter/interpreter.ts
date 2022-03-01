import { InterpreterOutput } from './game';
import { PlayerResponse } from '../types/playerTypes';
import { WebsocketMessage } from '../types/websocketTypes';
import { programNode } from './helpers';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const acorn = require(`acorn`);

export const interpret = (
    code: string,
    players: PlayerResponse[],
    gameState: Record<string, unknown>,
    phaseName: string,
    context?: WebsocketMessage,
): InterpreterOutput => {
    const parsedCode = acorn.parse(code, {
        ecmaVersion: `latest`,
    });

    const result = programNode(
        parsedCode,
        players,
        gameState,
        phaseName,
        context,
    );

    return result;
};
