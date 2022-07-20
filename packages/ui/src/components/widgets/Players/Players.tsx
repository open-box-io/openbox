import Player from '../../UI/Player/Player';
import { PlayerResponse } from '@openbox/common/src/types/playerTypes';
import React from 'react';
import styles from './players.module.scss';

interface PlayerProps {
    players: PlayerResponse[];
    host: PlayerResponse;
    currentPlayer: PlayerResponse;
}

const Players = ({
    players,
    host,
    currentPlayer,
}: PlayerProps): JSX.Element => {
    const renderPlayerList = () => {
        const playerRows = [];

        players.forEach((player) =>
            playerRows.push(
                <Player
                    player={player}
                    key={player._id}
                    isThisPlayerHost={player._id === host._id}
                    isCurrentPlayerHost={currentPlayer._id === host._id}
                />,
            ),
        );

        while (playerRows.length < 5) {
            playerRows.push(<Player key={playerRows.length} />);
        }

        playerRows.push(<Player key={playerRows.length} />);

        return playerRows;
    };

    return <div className={styles.Players}>{renderPlayerList()}</div>;
};
export default Players;
