import React, { useCallback } from 'react';

import Button from '../../UI/Button/Button';
import { useHistory } from 'react-router-dom';

const SignInButton = (): JSX.Element => {
    const history = useHistory();

    const onClick = useCallback(async () => {
        history.push(`signin`);
    }, []);

    return (
        <Button text clicked={onClick}>
            Sign In
        </Button>
    );
};

export default SignInButton;
