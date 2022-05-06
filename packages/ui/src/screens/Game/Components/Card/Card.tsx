import { CardComponent } from '@openbox/common';
import React from 'react';
import styles from './card.module.scss';

interface CardProps {
    component: CardComponent;
}

const Card = ({ component }: CardProps): JSX.Element => {
    return (
        <div className={styles.card}>
            <div>{component.data}</div>
        </div>
    );
};

export default Card;
