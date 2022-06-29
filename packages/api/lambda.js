/* eslint-disable @typescript-eslint/no-var-requires */
const { getAPI } = require(`./dist/api/src/app`);
const awsServerlessExpress = require(`aws-serverless-express`);

const server = awsServerlessExpress.createServer(getAPI());

module.exports.api = (event, context) =>
    awsServerlessExpress.proxy(server, event, context);
