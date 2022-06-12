import Player from '../../UI/Player/Player';
import { PlayerResponse } from '@openbox/common';
import React from 'react';
import styles from './players.module.scss';

interface PlayerProps {
    players: PlayerResponse[];
    host: PlayerResponse;
}

const Players = ({ players, host }: PlayerProps): JSX.Element => {
    const renderPlayerList = () => {
        const playerRows = [];

        players.forEach((player) =>
            playerRows.push(
                <Player player={player} key={player._id} host={host} />,
            ),
        );

        while (playerRows.length < 5) {
            playerRows.push(<Player host={host} key={playerRows.length} />);
        }

        playerRows.push(<Player host={host} key={playerRows.length} />);

        return playerRows;
    };

    return <div className={styles.Players}>{renderPlayerList()}</div>;
};
export default Players;
