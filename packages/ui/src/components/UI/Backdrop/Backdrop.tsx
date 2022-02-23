import { IconLogoBackdrop } from '../../../assets/svgs/svgIconLogo/svgIconLogo';
import React from 'react';
import { TextLogoBackdrop } from '../../../assets/svgs/svgTextLogo/svgTextLogo';
import styles from './backdrop.module.scss';

interface BackdropProps {
    lobby?: boolean;
}

const Backdrop = ({ lobby }: BackdropProps): JSX.Element => {
    const backdrop = (
        <>
            <div
                className={lobby ? styles.BackdropLobby : styles.Backdrop}
            ></div>
            {lobby ? null : <TextLogoBackdrop />}

            <IconLogoBackdrop />
        </>
    );

    return <>{backdrop}</>;
};
export default Backdrop;
