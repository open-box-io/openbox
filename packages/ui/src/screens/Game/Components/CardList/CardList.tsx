import { CardListComponent, ComponentTypes } from '@openbox/common';

import Card from '../Card/Card';
import React from 'react';
import styles from './cardList.module.scss';

interface CardListProps {
    component: CardListComponent;
}

const CardList = ({ component }: CardListProps): JSX.Element => {
    return (
        <div className={styles.cardList}>
            {component.data?.map((item, index) => (
                <Card
                    key={index}
                    component={{ type: ComponentTypes.CARD, data: item }}
                />
            ))}
        </div>
    );
};

export default CardList;
