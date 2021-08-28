import React, { useCallback, useState } from 'react';

import Backdrop from '../../components/UI/Backdrop/Backdrop';
import Button from '../../components/UI/Button/Button';
import Connect from '../../components/widgets/Connect/Connect';
import { JoinLobbyAPIResponse } from '@openbox/common/src/types/endpointTypes';
import Modal from '../../components/UI/Modal/Modal';
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
                    <Button
                        styling={`Default`}
                        clicked={() => setShowModal(`host`)}
                    >
                            HOST
                    </Button>
                    <p className={styles.Or}>
                        <span>OR</span>
                    </p>
                    <Button
                        styling={`Default`}
                        clicked={() => setShowModal(`join`)}
                    >
                            JOIN
                    </Button>
                    <p className={styles.Login}>Login / Register</p>
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
