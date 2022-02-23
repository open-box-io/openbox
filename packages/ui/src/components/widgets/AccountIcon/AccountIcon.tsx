import React from 'react';

import { IconLogo } from '../../../assets/svgs/svgIconLogo/svgIconLogo';
import styles from './accountIcon.module.scss';

const AccountIcon = (): JSX.Element | null => {
    return (
        <div className={styles.AccountIcon}>
            <IconLogo />
        </div>
    );
};

export default AccountIcon;
