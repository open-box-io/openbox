import React, { useEffect, useState } from 'react';

import Backdrop from '../../components/UI/Backdrop/Backdrop';
import Connect from '../../components/widgets/Connect/Connect';
import { GameInstance } from '@openbox/common/src/interpreter/game';
import GamePicker from '../../components/widgets/GamePicker/GamePicker';
import { GamemodeVersion } from '@openbox/common/src/types/gamemodeTypes';
import { JoinLobbyAPIResponse } from '@openbox/common/src/types/endpointTypes';
import { LobbyResponse } from '@openbox/common/src/types/lobbyTypes';
import Modal from '../../components/UI/Modal/Modal';
import { PlayerResponse } from '@openbox/common/src/types/playerTypes';
import { PlayerView } from '@openbox/common/src/types/componentTypes';
import Players from '../../components/widgets/Players/Players';
import RoomCode from '../../components/UI/RoomCode/RoomCode';
import Throbber from '../../components/UI/Throbber/Throbber';
import { getHeaders } from '../../store/store';
import styles from './lobby.module.scss';
import { useParams } from 'react-router-dom';

interface LobbyProps {
    lobby: LobbyResponse;
    player: PlayerResponse;
    setGame: (game: GameInstance) => void;
    connect: (player: string, lobby: string) => Promise<JoinLobbyAPIResponse>;
    reconnect: (player: string, lobby: string) => Promise<void>;
    onPlayerViewsChanged: (playerViews: PlayerView[]) => void;
}

interface LobbyParams {
    id: string;
}

const Lobby = ({
    lobby,
    player,
    setGame,
    connect,
    reconnect,
    onPlayerViewsChanged,
}: LobbyProps): JSX.Element => {
    const { id } = useParams<LobbyParams>(); // Lobby id from URL params.
    const [connecting, setConnecting] = useState<boolean>(false);

    useEffect(() => {
        if (lobby || player) return;

        const headers = getHeaders();
        if (!headers.playerId) return;
        if (!headers.lobbyId) return;
        if (headers.lobbyId !== id) return;

        setConnecting(true);
        reconnect(headers.playerId, id);
    }, [id, lobby, player, reconnect]);

    const isHost = player && lobby && player._id === lobby.host._id;

    const onGameStart = async (
        gamemode: GamemodeVersion,
        resources: string,
    ) => {
        lobby
            && setGame(
                new GameInstance(
                    lobby.players,
                    gamemode,
                    resources,
                    onPlayerViewsChanged,
                ),
            );
    };

    return (
        <>
            {lobby || player ? null : (
                <>
                    <Modal>
                        {connecting ? (
                            <Throbber altColour />
                        ) : (
                            <Connect
                                lobbyIdentifier={id}
                                connectionType={`join`}
                                connect={connect}
                            />
                        )}
                    </Modal>
                    <Backdrop />
                </>
            )}
            <div className={styles.Content}>
                <div className={styles.Lobby}>
                    {lobby ? (
                        <Players players={lobby.players} host={lobby.host} />
                    ) : null}
                    <RoomCode lobbyId={id} />
                </div>
                {isHost ? (
                    <GamePicker
                        selectGame={async (game, resourceName) => {
                            await onGameStart(game, resourceName);
                        }}
                    />
                ) : null}
            </div>
            <Backdrop lobby />
        </>
    );
};

export default Lobby;
