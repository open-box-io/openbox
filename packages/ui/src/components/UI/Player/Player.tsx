import Cross from '../../../assets/svgs/svgCross/svgCross';
import Crown from '../../../assets/svgs/svgCrown/svgCrown';
import { PlayerResponse } from '@openbox/common/src/types/playerTypes';
import React from 'react';
import { cssCombine } from '../../../shared/SCSS/scssHelpers';
import styles from './player.module.scss';

interface PlayerProps {
    player?: PlayerResponse;
    isThisPlayerHost?: boolean;
    isCurrentPlayerHost?: boolean;
}

const Player = ({
    player,
    isThisPlayerHost,
    isCurrentPlayerHost,
}: PlayerProps): JSX.Element => {
    const kickPlayer = () => {
        if (!player) return;
        //removePlayer(player._id);
    };

    return player ? (
        <div
            className={cssCombine(
                styles.Player,
                !isThisPlayerHost && isCurrentPlayerHost && styles.HostTools,
            )}
        >
            <p>{player.name}</p>
            {!isThisPlayerHost && isCurrentPlayerHost ? null : (
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
            {isThisPlayerHost ? <Crown color={`#FFBE00`} /> : null}
        </div>
    ) : (
        <div className={styles.Join}>
            <p>JOIN</p>
        </div>
    );
};

export default Player;
