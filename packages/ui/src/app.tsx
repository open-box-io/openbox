import React, { useCallback, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { createLobby, joinLobby } from './api/lobby';

import { JoinLobbyAPIResponse } from '@openbox/common/src/types/endpointTypes';
import Landing from './screens/Landing/Landing';
import Lobby from './screens/Lobby/Lobby';
import { LobbyResponse } from '@openbox/common/src/types/lobbyTypes';
import { PlayerResponse } from '@openbox/common/src/types/playerTypes';
import { getHeaders } from './store/store';
import styles from './app.module.scss';

const App = (): JSX.Element => {
    const [webSocket, setWebSocket] = useState<WebSocket>();

    const [lobby, setLobby] = useState<LobbyResponse>();
    const [player, setPlayer] = useState<PlayerResponse>();

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
