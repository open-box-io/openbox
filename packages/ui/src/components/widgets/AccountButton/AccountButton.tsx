import React from 'react';

import AccountIcon from '../AccountIcon/AccountIcon';
import styles from './accountButton.module.scss';

interface AccountButtonProps {
    onClick?: () => void;
}

const AccountButton = ({ onClick }: AccountButtonProps): JSX.Element | null => {
    return (
        <section className={styles.AccountButton} onClick={onClick}>
            <AccountIcon />
        </section>
    );
};

export default AccountButton;
