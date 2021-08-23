const { getAPI, connectionHandler } = require(`./dist/app`);
const awsServerlessExpress = require(`aws-serverless-express`);

const server = awsServerlessExpress.createServer(getAPI());

module.exports.api = (event, context) =>
    awsServerlessExpress.proxy(server, event, context);

module.exports.websocketConnection = connectionHandler;
