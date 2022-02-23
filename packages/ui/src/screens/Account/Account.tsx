import React, { useCallback, useContext, useState } from 'react';

import { AuthContext } from '../../auth/authContext';
import Backdrop from '../../components/UI/Backdrop/Backdrop';
import Button, { BUTTON_STYLE } from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import Modal from '../../components/UI/Modal/Modal';
import styles from './account.module.scss';
import { useHistory } from 'react-router';
import ConfirmInput from '../../components/UI/ConfirmInput/ConfirmInput';

const Account = (): JSX.Element => {
    const history = useHistory();
    const authContext = useContext(AuthContext);

    const back = useCallback(async () => {
        history.goBack();
    }, []);

    return (
        <>
            <Modal>
                <form onSubmit={() => undefined}>
                    <ConfirmInput
                        label="Email"
                        initialValue={`email`}
                        onConfirm={() => undefined}
                    />
                    <ConfirmInput
                        type="password"
                        label="Password"
                        initialValue={`password`}
                        onConfirm={() => undefined}
                    />
                    <Button style={BUTTON_STYLE.TEXT} onClick={() => undefined}>
                        Forgot Password
                    </Button>
                </form>

                <div className={styles.btnGroup}>
                    <Button onClick={() => undefined}>Sign In</Button>
                    <Button style={BUTTON_STYLE.TEXT} onClick={back}>
                        Back
                    </Button>
                </div>
            </Modal>
            <Backdrop />
        </>
    );
};

export default Account;
