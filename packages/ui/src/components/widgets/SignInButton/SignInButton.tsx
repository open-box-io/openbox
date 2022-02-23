import React, { useCallback, useContext, useState } from 'react';

import { AuthContext } from '../../../auth/authContext';
import Button, { BUTTON_STYLE } from '../../UI/Button/Button';
import { cssCombine } from '../../../shared/SCSS/scssHelpers';
import styles from './signInButton.module.scss';
import { useHistory } from 'react-router-dom';

const SignInButton = (): JSX.Element => {
    const history = useHistory();

    const onClick = useCallback(async () => {
        history.push(`signin`);
    }, []);

    return (
        <Button style={BUTTON_STYLE.TEXT} onClick={onClick}>
            Sign In
        </Button>
    );
};

export default SignInButton;
