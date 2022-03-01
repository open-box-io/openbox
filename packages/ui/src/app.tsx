import {
    GameInstance,
    PlayerView,
    WebsocketActionType,
    WebsocketMessage,
} from '../../common';
import React, { useCallback, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { createLobby, joinLobby } from './api/lobby';

import AuthProvider from './auth/authContext';
import Game from './screens/Game/Game';
import { JoinLobbyAPIResponse } from '../../common/src/types/endpointTypes';
import Landing from './screens/Landing/Landing';
import Lobby from './screens/Lobby/Lobby';
import { LobbyResponse } from '../../common/src/types/lobbyTypes';
import NewUserDetails from './screens/NewUserDetails/NewUserDetails';
import { PlayerResponse } from '../../common/src/types/playerTypes';
import SignIn from './screens/SignIn/SignIn';
import { getHeaders } from './store/store';
import styles from './app.module.scss';

const App = (): JSX.Element => {
    const [webSocket, setWebSocket] = useState<WebSocket>();

    const [lobby, setLobby] = useState<LobbyResponse>();
    const [player, setPlayer] = useState<PlayerResponse>();
    const [game, setGame] = useState<GameInstance>();

    const [playerView, setPlayerView] = useState<PlayerView>();

    const onPlayerViewsChanged = (playerViews: PlayerView[]) => {
        const headers = getHeaders();

        playerViews.forEach((view) => {
            if (view.player._id === player?._id) {
                setPlayerView(view);
            } else {
                webSocket?.send(
                    JSON.stringify({
                        lobbyId: headers.lobbyId,
                        playerId: headers.playerId,
                        secret: headers.secret,
                        recipientId: view.player._id,
                        message: {
                            action: {
                                type: WebsocketActionType.PLAYER_VIEW,
                            },
                            playerView: view,
                        },
                    }),
                );
            }
        });
    };

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
                    (event: MessageEvent<string>) => {
                        const data: WebsocketMessage = JSON.parse(event.data);

                        console.log(`websocket message: `, data);

                        switch (data.action.type) {
                        case WebsocketActionType.PLAYER_LEFT:
                        case WebsocketActionType.PLAYER_REMOVED:
                            // game?.playerLeft(lobby?.players || [], data);
                            setLobby(data.lobby);
                            break;

                        case WebsocketActionType.PLAYER_JOINED:
                            // game?.playerJoined(lobby?.players || [], data);
                            setLobby(data.lobby);
                            break;

                        case WebsocketActionType.PLAYER_VIEW:
                            setPlayerView(data.playerView);
                            break;
                        }
                    },
                );

                setWebSocket(newWebSocket);
            }),
        [],
    );

    const connect = useCallback(
        async (
            playerName: string,
            lobbyId?: string,
        ): Promise<JoinLobbyAPIResponse> =>
            new Promise((resolve, reject) => {
                (lobbyId ?
                    joinLobby(playerName, lobbyId)
                    : createLobby(playerName)
                )
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
                <AuthProvider>
                    <Switch>
                        <Route path="/signin" component={SignIn} />
                        <Route
                            path="/newuserdetails"
                            component={NewUserDetails}
                        />

                        <Route
                            path="/lobby/:id"
                            render={(props) =>
                                playerView ? (
                                    <Game
                                        lobby={lobby as LobbyResponse}
                                        player={player as PlayerResponse}
                                        playerView={playerView}
                                        webSocket={webSocket as WebSocket}
                                    />
                                ) : (
                                    <Lobby
                                        {...props}
                                        connect={connect}
                                        lobby={lobby as LobbyResponse}
                                        player={player as PlayerResponse}
                                        setGame={setGame}
                                        onPlayerViewsChanged={
                                            onPlayerViewsChanged
                                        }
                                    />
                                )
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
                </AuthProvider>
            </div>
        </>
    );
};

export default App;
