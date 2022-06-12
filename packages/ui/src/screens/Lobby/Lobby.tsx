import Backdrop from '../../components/UI/Backdrop/Backdrop';
import Connect from '../../components/widgets/Connect/Connect';
import { GameInstance } from '@openbox/common/src/interpreter/game';
import GamePicker from '../../components/widgets/GamePicker/GamePicker';
import { GamemodeVersion } from '@openbox/common';
import { JoinLobbyAPIResponse } from '@openbox/common/src/types/endpointTypes';
import { LobbyResponse } from '@openbox/common/src/types/lobbyTypes';
import Modal from '../../components/UI/Modal/Modal';
import { PlayerResponse } from '@openbox/common/src/types/playerTypes';
import { PlayerView } from '@openbox/common/src/types/componentTypes';
import Players from '../../components/widgets/Players/Players';
import React from 'react';
import RoomCode from '../../components/UI/RoomCode/RoomCode';
import styles from './lobby.module.scss';
import { useParams } from 'react-router-dom';

interface LobbyProps {
    lobby: LobbyResponse;
    player: PlayerResponse;
    setGame: (game: GameInstance) => void;
    connect: (player: string, lobby: string) => Promise<JoinLobbyAPIResponse>;
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
    onPlayerViewsChanged,
}: LobbyProps): JSX.Element => {
    const { id } = useParams<LobbyParams>(); // Lobby id from URL params.

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
                        <Connect
                            lobbyIdentifier={id}
                            connectionType={`join`}
                            connect={connect}
                        ></Connect>
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
