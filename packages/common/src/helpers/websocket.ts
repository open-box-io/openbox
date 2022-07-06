import { Lobby } from '../types/lobbyTypes';
import { Player } from '../types/playerTypes';
import { WebsocketMessage } from '../types/websocketTypes';

export const getEndpoint = (): string => {
    return `ws.open-box.io`;
};

export const sendToPlayer = async (
    player: Player,
    message: WebsocketMessage,
): Promise<void> => {
    console.log(`sending message to player`, { player, message });

    player.websocket.send(message, (error) =>
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
