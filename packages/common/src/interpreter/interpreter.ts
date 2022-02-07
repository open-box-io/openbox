import { InterpreterOutput } from './game';
import { programNode } from './helpers';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const acorn = require(`acorn`);

export const interpret = (code: string): InterpreterOutput => {
    const parsedCode = acorn.parse(code, {
        ecmaVersion: `latest`,
    });

    const result = programNode(parsedCode);

    return result;
};
