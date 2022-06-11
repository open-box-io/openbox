import { getHeaders, setHeaders } from '../store/store';

import { JoinLobbyAPIResponse } from '@openbox/common';
import { getSession } from '../auth/cognito';
import { openbox } from '../shared/axios';

export const createLobby = async (
    playerName: string,
): Promise<JoinLobbyAPIResponse> =>
    new Promise((resolve, reject) => {
        getSession().then((session) => {
            const config = {
                headers: {
                    'Content-Type': `application/json`,
                    Authorization: session.getIdToken().getJwtToken(),
                },
            };

            openbox
                .post<JoinLobbyAPIResponse>(`/lobby`, { playerName }, config)
                .then((response) => {
                    setHeaders({
                        playerId: response.data.player._id,
                        lobbyId: response.data.lobby._id,
                        secret: response.data.player.secret,
                    });
                    resolve(response.data);
                })
                .catch((err) => {
                    reject(err.response.data.error);
                });
        });
    });

export const joinLobby = async (
    playerName: string,
    lobbyId: string,
): Promise<JoinLobbyAPIResponse> =>
    new Promise((resolve, reject) => {
        const config = {
            headers: {
                'Content-Type': `application/json`,
                lobbyid: lobbyId,
            },
        };

        openbox
            .put<JoinLobbyAPIResponse>(`lobby/players`, { playerName }, config)
            .then((response) => {
                setHeaders({
                    playerId: response.data.player._id,
                    lobbyId: response.data.lobby._id,
                    secret: response.data.player.secret,
                });

                resolve(response.data);
            })
            .catch(reject);
    });

export const removePlayer = async (playerId: string): Promise<void> => {
    const headers = getHeaders();

    await openbox.delete<void>(`/lobby/players`, {
        headers: headers,
        data: { playerId },
    });
};
