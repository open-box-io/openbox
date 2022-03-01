import React, { useCallback, useContext, useState } from 'react';

import AccountButton from '../../components/widgets/AccountButton/AccountButton';
import { AuthContext } from '../../auth/authContext';
import Backdrop from '../../components/UI/Backdrop/Backdrop';
import Button, { BUTTON_STYLE } from '../../components/UI/Button/Button';
import Connect from '../../components/widgets/Connect/Connect';
import { JoinLobbyAPIResponse } from '@openbox/common';
import Modal from '../../components/UI/Modal/Modal';
import SignInButton from '../../components/widgets/SignInButton/SignInButton';
import styles from './landing.module.scss';

enum LANDING_SCREEN {
    LANDING,
    JOIN,
    HOST,
    ACCOUNT,
}

interface LandingProps {
    connect: (player: string, lobby: string) => Promise<JoinLobbyAPIResponse>;
}

const Landing = ({ connect }: LandingProps): JSX.Element => {
    const authContext = useContext(AuthContext);
    const signedIn = authContext.isSignedIn();

    const [showModal, setShowModal] = useState<LANDING_SCREEN>(
        LANDING_SCREEN.LANDING,
    );

    const signOut = () => {
        authContext.signOut();
        setShowModal(LANDING_SCREEN.LANDING);
    };

    const switchModal = useCallback(() => {
        switch (showModal) {
        case LANDING_SCREEN.LANDING:
            return (
                <div className={styles.modalContent}>
                    {signedIn ? (
                        <AccountButton
                            onClick={() =>
                                setShowModal(LANDING_SCREEN.ACCOUNT)
                            }
                        />
                    ) : null}
                    <Button
                        onClick={() => setShowModal(LANDING_SCREEN.HOST)}
                    >
                            HOST
                    </Button>
                    <p className={styles.Or}>
                        <span>OR</span>
                    </p>
                    <Button
                        onClick={() => setShowModal(LANDING_SCREEN.JOIN)}
                    >
                            JOIN
                    </Button>
                    {signedIn ? null : <SignInButton />}
                </div>
            );

        case LANDING_SCREEN.JOIN:
            return (
                <Connect
                    connectionType={`join`}
                    back={() => setShowModal(LANDING_SCREEN.LANDING)}
                    connect={connect}
                />
            );
        case LANDING_SCREEN.HOST:
            return (
                <Connect
                    connectionType={`host`}
                    back={() => setShowModal(LANDING_SCREEN.LANDING)}
                    connect={connect}
                />
            );

        case LANDING_SCREEN.ACCOUNT:
            return (
                <div className={styles.modalContent}>
                    <AccountButton
                        onClick={() => setShowModal(LANDING_SCREEN.LANDING)}
                    />
                    <Button style={BUTTON_STYLE.WARNING} onClick={signOut}>
                            Sign out
                    </Button>
                    <Button
                        style={BUTTON_STYLE.TEXT}
                        onClick={() => setShowModal(LANDING_SCREEN.LANDING)}
                    >
                            back
                    </Button>
                </div>
            );
        }
    }, [setShowModal, showModal, signedIn]);

    return (
        <>
            <Modal>{switchModal()}</Modal>
            <Backdrop />
        </>
    );
};

export default Landing;
