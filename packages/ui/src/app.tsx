import React, { useCallback, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import {
    WebsocketActionType,
    WebsocketMessage,
} from '../../common/src/types/websocketTypes';
import { createLobby, joinLobby } from './api/lobby';

import { GameInstance } from './game/game';
import { JoinLobbyAPIResponse } from '../../common/src/types/endpointTypes';
import Landing from './screens/Landing/Landing';
import Lobby from './screens/Lobby/Lobby';
import { LobbyResponse } from '../../common/src/types/lobbyTypes';
import { PlayerResponse } from '../../common/src/types/playerTypes';
import { getHeaders } from './store/store';
import styles from './app.module.scss';

const App = (): JSX.Element => {
    const [webSocket, setWebSocket] = useState<WebSocket>();

    const [lobby, setLobby] = useState<LobbyResponse>();
    const [player, setPlayer] = useState<PlayerResponse>();
    const [game, setGame] = useState<GameInstance>();

    const connectToWebSocket = useCallback(
        (): Promise<void> =>
            new Promise((resolve) => {
                const headers = getHeaders();

                const newWebSocket = new WebSocket(
                    `wss://ws.open-box.io?lobbyId=${headers.lobbyId}&playerId=${headers.playerId}&secret=${headers.secret}`,
                );

                newWebSocket.addEventListener(`open`, () => {
                    resolve();
                });

                newWebSocket.addEventListener(
                    `message`,
                    (event: MessageEvent<WebsocketMessage>) => {
                        switch (event.data.action.type) {
                        case WebsocketActionType.PLAYER_LEFT:
                        case WebsocketActionType.PLAYER_REMOVED:
                            game?.playerLeft(
                                lobby?.players || [],
                                event.data,
                            );
                            setLobby(event.data.lobby);
                            break;

                        case WebsocketActionType.PLAYER_JOINED:
                            game?.playerJoined(
                                lobby?.players || [],
                                event.data,
                            );
                            setLobby(event.data.lobby);
                            break;

                        case WebsocketActionType.GAME_SUBMIT:
                            game?.submit(lobby?.players || [], event.data);
                            break;

                        case WebsocketActionType.GAME_REQUEST:
                            game?.request(event.data);
                            break;
                        }
                    },
                );

                setWebSocket(newWebSocket);
            }),
        [],
    );

    const createOnSubmit = async (player: string) => await createLobby(player);

    const joinOnSubmit = async (player: string, lobby: string) =>
        await joinLobby(player, lobby);

    const connect = useCallback(
        async (player: string, lobby?: string): Promise<JoinLobbyAPIResponse> =>
            new Promise((resolve, reject) => {
                (lobby ? joinOnSubmit(player, lobby) : createOnSubmit(player))
                    .then((response) => {
                        setLobby(response.lobby);
                        setPlayer(response.player);

                        connectToWebSocket()
                            .then(() => {
                                resolve(response);
                            })
                            .catch(reject);
                    })
                    .catch(reject);
            }),
        [setLobby, setPlayer],
    );

    return (
        <>
            <div className={styles.App}>
                <Switch>
                    <Route
                        path="/lobby/:id"
                        render={(props) =>
                            lobby ? (
                                <Lobby
                                    {...props}
                                    connect={connect}
                                    lobby={lobby}
                                />
                            ) : null
                        }
                    />
                    <Route
                        exact
                        path="/"
                        render={(props) => (
                            <Landing {...props} connect={connect} />
                        )}
                    />
                </Switch>
            </div>
        </>
    );
};

export default App;
