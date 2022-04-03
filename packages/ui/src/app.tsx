import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import {
    WebsocketActionType,
    WebsocketMessage,
} from '@openbox/common/src/types/websocketTypes';
import { createLobby, joinLobby } from './api/lobby';

import AuthProvider from './auth/authContext';
import Game from './screens/Game/Game';
import { GameInstance } from '@openbox/common/src/interpreter/game';
import { JoinLobbyAPIResponse } from '@openbox/common/src/types/endpointTypes';
import Landing from './screens/Landing/Landing';
import Lobby from './screens/Lobby/Lobby';
import { LobbyResponse } from '@openbox/common/src/types/lobbyTypes';
import NewUserDetails from './screens/NewUserDetails/NewUserDetails';
import { PlayerResponse } from '@openbox/common/src/types/playerTypes';
import { PlayerView } from '@openbox/common/src/types/componentTypes';
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
        playerViews.forEach((view) => {
            if (view.player._id === player?._id) {
                setPlayerView(view);
            } else {
                const headers = getHeaders();

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

    useEffect(() => {
        if (webSocket) {
            webSocket.onmessage = event;
        }
    }, [lobby, game, setLobby, setGame]);

    const event = useCallback(
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
            case WebsocketActionType.GAME_SUBMIT:
                lobby && game && game.submit(lobby.players, data);
                break;
            }
        },
        [lobby, game, setLobby, setGame],
    );

    const connectToWebSocket = useCallback((): void => {
        const headers = getHeaders();

        const newWebSocket = new WebSocket(
            `wss://ws.open-box.io?lobbyId=${headers.lobbyId}&playerId=${headers.playerId}&secret=${headers.secret}`,
        );

        setWebSocket(newWebSocket);
    }, []);

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

                        connectToWebSocket();

                        resolve(response);
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
