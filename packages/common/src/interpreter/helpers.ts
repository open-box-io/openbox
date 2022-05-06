import { PlayerResponse } from '../types/playerTypes';
import { WebsocketMessage } from '../types/websocketTypes';
import { Node, NodeParser, nodeParsers } from './nodes';
import { cloneDeep } from 'lodash';

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
        `GAME ERROR: ${message}.\nVariables: ${JSON.stringify(
            variables,
        )}\nNode: ${JSON.stringify(node)}`,
    );
};

export const getIdentiferName: NodeParser = (node, ...variables) => {
    if (node.type == `Identifier`) {
        return node.name;
    }

    if (node.type == `MemberExpression`) {
        const property = getIdentiferName(node.property, ...variables);

        return property;
    }

    return parseNode(node, ...variables);
};

export const getIdentifierContext: NodeParser = (node, ...variables) => {
    if (node.type == `Identifier`) {
        return variables[0];
    }

    if (node.type == `MemberExpression`) {
        const object = parseNode(node.object, ...variables);

        return object;
    }

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

export const programNode = (
    node: Node,

    players: PlayerResponse[],
    gameState: Record<string, unknown>,
    phaseName: string,
    context?: WebsocketMessage,
): any => {
    const programVariables = {
        players: cloneDeep(players),
        gameState: cloneDeep(gameState),
        phaseName: cloneDeep(phaseName),
        playerViews: [],
        context: cloneDeep(context),
    };

    // parse code
    const body = <Node[]>node.body;

    body.forEach((subNode) => {
        parseNode(subNode, programVariables);
    });

    return programVariables;
};
