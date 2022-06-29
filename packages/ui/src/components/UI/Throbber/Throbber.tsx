import { IconLogo } from '../../../assets/svgs/svgIconLogo/svgIconLogo';
import React from 'react';
import { cssCombine } from '../../../shared/SCSS/scssHelpers';
import styles from './throbber.module.scss';

interface ThobberProps {
    altColour?: boolean;
}

const Throbber = ({ altColour }: ThobberProps): JSX.Element => {
    return (
        <div
            className={cssCombine(
                styles.Throbber,
                altColour ? styles.White : styles.Blue,
            )}
        >
            <IconLogo />
        </div>
    );
};

export default Throbber;
