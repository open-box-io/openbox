// eslint-disable-next-line @typescript-eslint/no-var-requires
const ws = require(`ws`);

const wss = new ws.Server({ port: 443 });
const clients: any[] = [];

wss.on(`connection`, (ws: any) => {
    clients.push(ws);
    console.log(`connected`, ws);

    ws.on(`message`, (messageAsString: string) => {
        const message = JSON.parse(messageAsString);

        clients.forEach((client) => {
            client.send(JSON.stringify(message));
        });
    });

    wss.on(`close`, () => {
        clients.filter((client) => client !== ws);
    });
});

console.log(`wss up`);
