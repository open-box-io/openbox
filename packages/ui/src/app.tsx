import React, { useCallback, useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import {
    WebsocketActionType,
    WebsocketMessage,
} from '@openbox/common/src/types/websocketTypes';

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
import styles from './app.module.scss';

const App = (): JSX.Element => {
    const history = useHistory();

    const [webSocket, setWebSocket] = useState<WebSocket>();

    const [lobby, setLobby] = useState<LobbyResponse>();
    const [player, setPlayer] = useState<PlayerResponse | undefined>();
    const [game, setGame] = useState<GameInstance>();

    const [playerView, setPlayerView] = useState<PlayerView>();

    const onPlayerViewsChanged = useCallback(
        (playerViews: PlayerView[]) => {
            playerViews.forEach((view) => {
                if (view.player._id === player?._id) {
                    setPlayerView(view);
                } else {
                    webSocket?.send(
                        JSON.stringify({
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
        },
        [player?._id, webSocket, setPlayerView],
    );

    const event = useCallback(
        (event: MessageEvent<string>) => {
            const data = JSON.parse(event.data);

            console.log(`WEBSOCKET - Recieved: `, data);

            if (!data.message && !data.action && data.body) {
                if (data.statusCode === 200) {
                    setPlayer(data.body.player);
                    setLobby(data.body.lobby);

                    return history.push(`/lobby/${data.body.lobby._id}`);
                }
            }

            if (data.message === `Internal server error`) return;

            switch (data.action.type) {
            case WebsocketActionType.PLAYER_LEFT:
            case WebsocketActionType.PLAYER_REMOVED:
                // game?.playerLeft(lobby?.players || [], data);
                setLobby(data.lobby);

                if (data.action.player?._id === player?._id) {
                    setWebSocket(undefined);
                    setLobby(undefined);
                    setPlayer(undefined);
                    setGame(undefined);
                    setPlayerView(undefined);

                    history.push(``);
                }
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
        [player, lobby, game, history],
    );

    useEffect(() => {
        if (webSocket) {
            webSocket.onmessage = event;
        }
    }, [lobby, game, setLobby, setGame, webSocket, event]);

    const connectToWebSocket = useCallback(
        (playerName: string, lobbyId?: string): void => {
            const newWebSocket = new WebSocket(
                `wss://ws.open-box.io?playerName=${playerName}${
                    lobbyId ? `&lobbyId=${lobbyId}` : ``
                }`,
            );

            setWebSocket(newWebSocket);
        },
        [],
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
                                        connect={connectToWebSocket}
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
                                <Landing
                                    {...props}
                                    connect={connectToWebSocket}
                                />
                            )}
                        />
                    </Switch>
                </AuthProvider>
            </div>
        </>
    );
};

export default App;
