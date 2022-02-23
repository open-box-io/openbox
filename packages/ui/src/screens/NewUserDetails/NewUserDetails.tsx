import React, { useCallback, useContext, useState } from 'react';

import { AuthContext } from '../../auth/authContext';
import Backdrop from '../../components/UI/Backdrop/Backdrop';
import Button, { BUTTON_STYLE } from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import Modal from '../../components/UI/Modal/Modal';
import styles from './newUserDetails.module.scss';
import { useHistory } from 'react-router';

const NewUserDetails = (): JSX.Element => {
    const history = useHistory();
    const authContext = useContext(AuthContext);

    const [nickname, setNickname] = useState<string>(``);

    const [newPassword1, setNewPassword1] = useState<string>(``);
    const [newPassword2, setNewPassword2] = useState<string>(``);

    const [error, setError] = useState<string>(``);

    const onChange
        = (setter: (value: React.SetStateAction<string>) => void) =>
            (event: React.ChangeEvent<HTMLInputElement>): void => {
                setter(() => event.target.value);
            };

    const back = useCallback(async () => {
        history.goBack();
    }, []);

    const changePasswordClicked = async () => {
        try {
            await authContext.completeNewPassword(nickname, newPassword1);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <>
            <Modal>
                <h1>Enter new details</h1>
                <form onSubmit={changePasswordClicked}>
                    <Input
                        type="text"
                        label="Username"
                        value={nickname}
                        onChange={onChange(setNickname)}
                    />
                    <Input
                        type="Password"
                        label="New Password"
                        value={newPassword1}
                        onChange={onChange(setNewPassword1)}
                    />
                    <Input
                        type="Password"
                        label="New Password"
                        value={newPassword2}
                        onChange={onChange(setNewPassword2)}
                    />
                </form>
                <div className={styles.btnGroup}>
                    <Button onClick={changePasswordClicked}>
                        Change Password
                    </Button>
                    <Button style={BUTTON_STYLE.TEXT} onClick={back}>
                        Back
                    </Button>
                </div>
            </Modal>
            <Backdrop />
        </>
    );
};

export default NewUserDetails;
