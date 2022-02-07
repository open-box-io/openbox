import { programNode } from './helpers';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const acorn = require(`acorn`);

export const interpret = (code: string): void => {
    const parsedCode = acorn.parse(code, {
        ecmaVersion: `latest`,
    });

    console.log(JSON.stringify(parsedCode));

    const result = programNode(parsedCode);

    console.log(result);
};
