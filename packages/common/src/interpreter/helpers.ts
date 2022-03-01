import { Node, NodeParser, nodeParsers } from './nodes';

export const defaultNode: NodeParser = (node, ...variables) =>
    reportGameError(`unknown node type ${node.type}`, node, ...variables);

export const parseNode: NodeParser = (node, ...variables): unknown => {
    const parser = nodeParsers[node.type] || defaultNode;
    const result = parser(node, ...variables);

    return result;
};

export const reportGameError = (
    message: string,
    node: Node,
    ...variables: { [key: string]: unknown }[]
): void => {
    console.log(
        `GAME ERROR: ${message}.\nNode: ${JSON.stringify(
            node,
        )}\nVariables: ${JSON.stringify(variables)}`,
    );
};

export const getIdentiferName: NodeParser = (node, ...variables) => {
    if (node.type == `Identifier`) return node.name;

    return parseNode(node, ...variables);
};

export const getVariable = (
    variableName: string,
    ...variables: { [key: string]: unknown }[]
): any => {
    const variableGroup = variables.find(
        (variableGroup) => variableGroup[variableName] !== undefined,
    );
    return variableGroup ? variableGroup[variableName] : undefined;
};

export const programNode = (node: Node): any => {
    const programVariables = {};
    let last = undefined;

    // parse code
    const body = <Node[]>node.body;
    body.forEach((subNode) => {
        const result = parseNode(subNode, programVariables);

        if (result !== undefined) {
            last = result;
        }
    });

    // return value from last line
    return last;
};
