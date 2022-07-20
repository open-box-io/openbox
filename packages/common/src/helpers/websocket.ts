import { Lobby } from '../types/lobbyTypes';
import { Player } from '../types/playerTypes';
import { WebsocketMessage } from '../types/websocketTypes';

export const getEndpoint = (): string => {
    return `ws.open-box.io`;
};

export const getQueryParamaters = (
    queryString: string,
): { [key: string]: string } => {
    const queryParamString = queryString.split(`?`)[1];
    const queryParamFinder = new URLSearchParams(queryParamString);

    const queryParams: { [key: string]: string } = {};
    for (const param of queryParamFinder) {
        queryParams[param[0]] = param[1];
    }

    return queryParams;
};

export const sendToPlayer = async (
    player: Player,
    message: WebsocketMessage,
): Promise<void> => {
    console.log(`sending message to player`, { player, message });

    player.websocket.send(JSON.stringify(message), (error) =>
        console.log(`failed to send message to player`, { player, error }),
    );
};

export const sendToLobby = async (
    lobby: Lobby,
    message: WebsocketMessage,
): Promise<void> => {
    for (let i = 0; i < lobby.players.length; i++) {
        await sendToPlayer(lobby.players[i], message);
    }
};
