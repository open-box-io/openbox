import ws from 'ws';

export class Player {
    _id: string;
    hash: string;
    name: string;
    websocket: ws.WebSocket;
}

export class PlayerResponse {
    _id: string;
    name: string;
}

export class PlayerSecretResponse extends PlayerResponse {
    secret: string;
}
