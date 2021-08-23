import React from 'react';
import styles from './roomcode.module.scss';

interface RoomCodeProps {
    lobbyId: string;
}

const RoomCode = ({ lobbyId }: RoomCodeProps): JSX.Element => {
    return (
        <div className={styles.RoomCode}>
            <h1>Room Code</h1>
            <p>{lobbyId}</p>
        </div>
    );
};

export default RoomCode;
