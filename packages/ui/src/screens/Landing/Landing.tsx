import React, { useCallback, useState } from 'react';

import Backdrop from '../../components/UI/Backdrop/Backdrop';
import Button from '../../components/UI/Button/Button';
import Connect from '../../components/widgets/Connect/Connect';
import { JoinLobbyAPIResponse } from '@openbox/common';
import Modal from '../../components/UI/Modal/Modal';
import SignInButton from '../../components/widgets/SignInButton/SignInButton';
import styles from './landing.module.scss';

interface LandingProps {
    connect: (player: string, lobby: string) => Promise<JoinLobbyAPIResponse>;
}

const Landing = ({ connect }: LandingProps): JSX.Element => {
    const [showModal, setShowModal] = useState<string>();

    const switchModal = useCallback(() => {
        switch (showModal) {
        case `join`:
            return (
                <Connect
                    connectionType={`join`}
                    back={() => setShowModal(``)}
                    connect={connect}
                />
            );
        case `host`:
            return (
                <Connect
                    connectionType={`host`}
                    back={() => setShowModal(``)}
                    connect={connect}
                />
            );
        default:
            return (
                <div className={styles.btnGroup}>
                    <Button clicked={() => setShowModal(`host`)}>
                            HOST
                    </Button>
                    <p className={styles.Or}>
                        <span>OR</span>
                    </p>
                    <Button clicked={() => setShowModal(`join`)}>
                            JOIN
                    </Button>
                    <SignInButton small />
                </div>
            );
        }
    }, [setShowModal, showModal]);

    return (
        <>
            <Modal>{switchModal()}</Modal>
            <Backdrop />
        </>
    );
};

export default Landing;
