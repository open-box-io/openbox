import { JoinLobbyAPIResponse, LobbyResponse } from '@openbox/common';

import Backdrop from '../../components/UI/Backdrop/Backdrop';
import Connect from '../../components/widgets/Connect/Connect';
import Modal from '../../components/UI/Modal/Modal';
import Players from '../../components/widgets/Players/Players';
import React from 'react';
import RoomCode from '../../components/UI/RoomCode/RoomCode';
import styles from './lobby.module.scss';
import { useParams } from 'react-router-dom';

interface LobbyProps {
    lobby: LobbyResponse;
    connect: (player: string, lobby: string) => Promise<JoinLobbyAPIResponse>;
}

interface LobbyParams {
    id: string;
}

const Lobby = ({ lobby, connect }: LobbyProps): JSX.Element => {
    const { id } = useParams<LobbyParams>(); // Lobby id from URL params.

    return (
        <>
            {lobby ? null : (
                <>
                    <Modal>
                        <Connect
                            lobbyIdentifier={id}
                            connectionType="host"
                            connect={connect}
                        ></Connect>
                    </Modal>
                    <Backdrop />
                </>
            )}
            <div className={styles.Lobby}>
                {lobby ? (
                    <Players players={lobby.players} host={lobby.host} />
                ) : null}
                <RoomCode lobbyId={id} />
            </div>
            <Backdrop lobby />
        </>
    );
};

export default Lobby;
