const { getAPI } = require(`./dist/api/src/app`);
const port = process.env.PORT || 8000;

// Server
getAPI().listen(port, () => {
    console.log(`Listening on: http://localhost:${port}`);
});