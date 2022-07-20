import ws from 'ws';

export class Player {
    _id: string;
    name: string;
    websocket: ws.WebSocket;
    missedPings?: number;
}

export class PlayerResponse {
    _id: string;
    name: string;
}
