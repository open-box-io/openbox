import React, { useCallback, useContext, useState } from 'react';

import { AuthContext } from '../../auth/authContext';
import Backdrop from '../../components/UI/Backdrop/Backdrop';
import Button, { BUTTON_STYLE } from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import Modal from '../../components/UI/Modal/Modal';
import styles from './signIn.module.scss';
import { useHistory } from 'react-router';

const SignIn = (): JSX.Element => {
    const history = useHistory();
    const authContext = useContext(AuthContext);

    const [email, setEmail] = useState<string>(``);
    const [password, setPassword] = useState<string>(``);
    const [error, setError] = useState<string>(``);

    const onEmailChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        setEmail(() => event.target.value);
    };

    const onPasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        setPassword(() => event.target.value);
    };

    const signInClicked = async () => {
        try {
            authContext.signInWithEmail(email, password);
        } catch (err: any) {
            if (err.code === `UserNotConfirmedException`) {
                history.push(`verify`);
            } else {
                setError(err.message);
            }
        }
    };

    const back = useCallback(async () => {
        history.goBack();
    }, []);

    return (
        <>
            <Modal>
                <form onSubmit={signInClicked}>
                    <Input
                        label="Email"
                        value={email}
                        onChange={onEmailChange}
                    />
                    <Input
                        type="password"
                        label="Password"
                        value={password}
                        onChange={onPasswordChange}
                    />
                    <Button style={BUTTON_STYLE.TEXT} onClick={() => undefined}>
                        Forgot Password
                    </Button>
                </form>

                <div className={styles.btnGroup}>
                    <Button onClick={signInClicked}>Sign In</Button>
                    <Button style={BUTTON_STYLE.TEXT} onClick={back}>
                        Back
                    </Button>
                </div>
            </Modal>
            <Backdrop />
        </>
    );
};

export default SignIn;
