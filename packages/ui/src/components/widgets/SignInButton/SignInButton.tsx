import React, { useCallback, useContext } from 'react';

import { AuthContext } from '../../../auth/authContext';
import Button from '../../UI/Button/Button';
import styles from './SignInButton.module.scss';
import { useHistory } from 'react-router-dom';

interface SignInButtonProps {
    small?: boolean;
}

const SignInButton = (props: SignInButtonProps): JSX.Element | null => {
    const history = useHistory();

    const authContext = useContext(AuthContext);

    const signedIn = authContext.isSignedIn();

    const nickname = authContext.attrInfo?.find(
        (att) => att.Name === `nickname`,
    );

    const onClick = useCallback(async () => {
        history.push(`signin`);
    }, []);

    const renderAccountButton = () => (
        <div className={styles.AccountPill}>
            <p className={styles.AccountName}>sammieaurelia</p>

            <p className={styles.AccountImage}>
                {nickname?.Value.charAt(0).toUpperCase() || ``}
            </p>
        </div>
    );

    return signedIn ? (
        props.small ? null : (
            renderAccountButton()
        )
    ) : (
        <Button text={props.small} clicked={onClick}>
            Sign In
        </Button>
    );
};

export default SignInButton;
