import OpenBoxIcon from '../../../assets/svgs/svgIconLogo/svgIconLogo';
import OpenBoxText from '../../../assets/svgs/svgTextLogo/svgTextLogo';
import React from 'react';
import SignInButton from '../../widgets/SignInButton/SignInButton';
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
            {lobby ? null : <OpenBoxText />}

            <OpenBoxIcon />
        </>
    );

    return (
        <>
            <div className={styles.SignIn}>
                <SignInButton />
            </div>
            {backdrop}
        </>
    );
};
export default Backdrop;
