import AWS from 'aws-sdk';
import { Lobby } from '../types/lobbyTypes';
import { Player } from '../types/playerTypes';
import { WebsocketMessage } from '../types/websocketTypes';

export const getEndpoint = (): string => {
    return `ws.open-box.io`;
};

export const getAwsgwManagementApi = () => {
    return new AWS.ApiGatewayManagementApi({
        apiVersion: `2018-11-29`,
        endpoint: getEndpoint(),
    });
};

export const sendToPlayer = async (
    player: Player,
    message: WebsocketMessage,
): Promise<void> => {
    const apigwManagementApi = getAwsgwManagementApi();

    if (!player.websocketId) return;

    const params = {
        ConnectionId: player.websocketId,
        Data: JSON.stringify(message),
    };

    await apigwManagementApi
        .postToConnection(params)
        .promise()
        .then(() => {
            console.log(`sent message to player: ${player._id}`);
        })
        .catch((error) => {
            console.log(`failed to send message to player`, { player, error });
        });
};

export const sendToLobby = async (
    lobby: Lobby,
    message: WebsocketMessage,
): Promise<void> => {
    for (let i = 0; i < lobby.players.length; i++) {
        await sendToPlayer(lobby.players[i], message);
    }
};

export const disconnectPlayer = async (player: Player): Promise<void> => {
    if (!player.websocketId) {
        return;
    }

    const apigwManagementApi = getAwsgwManagementApi();

    apigwManagementApi
        .deleteConnection({
            ConnectionId: player.websocketId,
        })
        .promise()
        .then(() => {
            console.log(`websocket connection closed`, { player });
        });
};
