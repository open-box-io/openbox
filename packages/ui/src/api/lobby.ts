import { getHeaders, setHeaders } from '../store/store';

import { JoinLobbyAPIResponse } from '@openbox/common';
import axios from '../shared/axios';
import { getSession } from '../auth/cognito';

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

            axios
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

        axios
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

    await axios.delete<void>(`/lobby/players`, {
        headers: headers,
        data: { playerId },
    });
};
