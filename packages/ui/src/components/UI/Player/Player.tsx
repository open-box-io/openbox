import Cross from '../../../assets/svgs/svgCross/svgCross';
import Crown from '../../../assets/svgs/svgCrown/svgCrown';
import { PlayerResponse } from '@openbox/common';
import React from 'react';
import { getHeaders } from '../../../store/store';
import { removePlayer } from '../../../api/lobby';
import styles from './player.module.scss';

interface PlayerProps {
    player?: PlayerResponse;
    host: PlayerResponse;
}

const Player = ({ player, host }: PlayerProps): JSX.Element => {
    const headers = getHeaders();

    const kickPlayer = () => {
        if (!player) return;
        removePlayer(player._id);
    };

    const styleArray = [styles.Player];

    if (
        host._id === headers.playerId
        && host._id !== player?._id
        && player?._id
    ) {
        styleArray.push(styles.HostTools);
    }

    return player ? (
        //player exists
        <div className={[...styleArray].join(` `)}>
            <p>{player.name}</p>
            {host._id !== headers.playerId || host._id === player._id ? null : (
                <div>
                    <button style={{ backgroundColor: `white` }}>
                        <Crown />
                    </button>
                    <button
                        style={{ backgroundColor: `black` }}
                        onClick={kickPlayer}
                    >
                        <Cross />
                    </button>
                </div>
            )}
            {host._id === player._id ? <Crown color={`#FFBE00`} /> : null}
        </div>
    ) : (
        //player does not exist
        <div className={styles.Join}>
            <p>JOIN</p>
        </div>
    );
};

export default Player;
