/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getIdentiferName,
    getVariable,
    parseNode,
    reportGameError,
} from './helpers';

export interface Node {
    type: string;

    alternate: Node;
    argument: Node;
    arguments: Node[];
    body: Node | Node[];
    callee: Node;
    consequent: Node;
    declarations: Node[];
    elements: Node[];
    expression: Node;
    id: Node;
    init: Node;
    key: Node;
    kind: string;
    left: Node;
    name: string;
    object: Node;
    operator: string;
    params: Node[];
    prefix: boolean;
    properties: Node[];
    property: Node;
    right: Node;
    test: Node;
    value: string | number | boolean | Node;
}

export type NodeParser = (
    node: Node,
    ...variables: { [key: string]: unknown }[]
) => any;

const ArrayExpression: NodeParser = (node, ...variables) => {
    const array: unknown[] = [];

    node.elements?.forEach((element) => {
        array.push(parseNode(element, ...variables));
    });

    return array;
};

const ArrowFunctionExpression: NodeParser = (node, ...variables) => {
    const paramNames = node.params.map((param) => getIdentiferName(param));

    const fn = (...args: any[]) => {
        const params: { [key: string]: unknown } = {};
        paramNames.forEach((paramName, i) => {
            params[paramName] = args[i];
        });

        return parseNode(<Node>node.body, params, ...variables);
    };

    return fn;
};

const AssignmentExpression: NodeParser = (node, ...variables) => {
    const operator = node.operator;
    const left = getIdentiferName(node.left, ...variables);
    const right = parseNode(node.right, ...variables);

    switch (operator) {
    case `=`:
        variables[0][left] = right;
        break;

    default:
        reportGameError(`Unknown operator ${operator}`, node, ...variables);
    }
};

const BinaryExpression: NodeParser = (node, ...variables) => {
    const operator = node.operator;
    const left = parseNode(node.left, ...variables);
    const right = parseNode(node.right, ...variables);

    switch (operator) {
    case `==`:
        return left == right;
    case `!=`:
        return left != right;
    case `===`:
        return left === right;
    case `!==`:
        return left !== right;
    case `>`:
        return left > right;
    case `>=`:
        return left >= right;
    case `<`:
        return left < right;
    case `<=`:
        return left <= right;

    case `%`:
        return left % right;
    case `-`:
        return left - right;
    case `+`:
        return left + right;
    case `*`:
        return left * right;
    case `/`:
        return left / right;
    case `**`:
        return left ** right;

    case `&`:
        return left & right;
    case `|`:
        return left | right;
    case `^`:
        return left ^ right;
    case `<<`:
        return left << right;
    case `>>`:
        return left >> right;
    case `>>>`:
        return left >>> right;

    default:
        reportGameError(`Unknown operator ${operator}`, node, ...variables);
    }
};

const CallExpression: NodeParser = (node, ...variables) => {
    const callee = parseNode(node.callee, ...variables);
    const args = node.arguments.map((arg) => parseNode(arg, ...variables));

    return callee(...args);
};

const ConditionalExpression: NodeParser = (node, ...variables) => {
    const test = parseNode(node.test, ...variables);
    const consequent = parseNode(node.consequent, ...variables);
    const alternate = parseNode(node.alternate, ...variables);

    return test ? consequent : alternate;
};

const ExpressionStatement: NodeParser = (node, ...variables) =>
    parseNode(<Node>node.expression, ...variables);

const Identifier: NodeParser = (node, ...variables) => {
    const name = node.name;

    switch (name) {
    case `console`:
        return {
            log: console.log,
        };

    case `JSON`:
        return {
            stringify: JSON.stringify,
        };

    default:
        return getVariable(name, ...variables);
    }
};

const Literal: NodeParser = (node) => node.value;

const LogicalExpression: NodeParser = (node, ...variables) => {
    const operator = node.operator;
    const left = parseNode(node.left, ...variables);
    const right = parseNode(node.right, ...variables);

    switch (operator) {
    case `&&`:
        return left && right;
    case `||`:
        return left || right;

    default:
        reportGameError(`Unknown operator ${operator}`, node, ...variables);
    }
};

const MemberExpression: NodeParser = (node, ...variables) => {
    const object = parseNode(node.object, ...variables);
    const property = getIdentiferName(node.property, ...variables);

    //handle prototype functions, which oddly need to be curried???
    if (typeof object[property] === `function`) {
        return (...args: any[]) => object[property](...args);
    }

    return object[property];
};

const ObjectExpression: NodeParser = (node, ...variables) => {
    let object = {};

    node.properties.forEach((property) => {
        const subObject = parseNode(property, ...variables);
        object = {
            ...object,
            ...subObject,
        };
    });

    return object;
};

const Property: NodeParser = (node, ...variables) => ({
    [getIdentiferName(node.key, ...variables)]: parseNode(
        <Node>node.value,
        ...variables,
    ),
});

const UnaryExpression: NodeParser = (node, ...variables) => {
    const { operator } = node;
    const argument = parseNode(node.argument, ...variables);

    switch (operator) {
    case `!`:
        return !argument;

    default:
        reportGameError(`Unknown operator ${operator}`, node, ...variables);
    }

    return argument;
};

const VariableDeclaration: NodeParser = (node, ...variables) => {
    const { declarations } = node;

    declarations.forEach((declarator) => {
        parseNode(declarator, ...variables);
    });
};

const VariableDeclarator: NodeParser = (node, ...variables) => {
    const id = getIdentiferName(node.id, ...variables);
    const init = parseNode(node.init, ...variables);

    variables[0][id] = init;
};

export const nodeParsers: { [key: string]: NodeParser } = {
    ArrayExpression,
    ArrowFunctionExpression,
    AssignmentExpression,
    BinaryExpression,
    CallExpression,
    ConditionalExpression,
    ExpressionStatement,
    Identifier,
    Literal,
    LogicalExpression,
    MemberExpression,
    ObjectExpression,
    Property,
    UnaryExpression,
    VariableDeclaration,
    VariableDeclarator,
};
