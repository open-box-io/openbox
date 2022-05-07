import {
    CardListComponent,
    Component,
    ComponentTypes,
} from '@openbox/common/src/types/componentTypes';

import Card from '../Card/Card';
import React from 'react';
import styles from './cardList.module.scss';

interface CardListProps {
    component: CardListComponent;
    onSubmit: (prop: Component) => void;
    onChange: (prop: Component) => void;
}

const CardList = ({ component, onSubmit }: CardListProps): JSX.Element => {
    const onCardClick = (index: number) => {
        const maxSelectable = component.settings?.maxSelectable;
        if (!maxSelectable) return;

        let newCardList;

        if (maxSelectable === 1) {
            newCardList = component.data.map((card, i) => ({
                ...card,
                selected: index === i ? !card.selected : false,
            }));
        } else {
            const selectedCards = component.data.filter(
                (card) => card.selected,
            );

            if (maxSelectable <= selectedCards.length) return;

            newCardList = component.data.map((card, i) => ({
                ...card,
                selected: index === i ? !card.selected : card.selected,
            }));
        }

        onSubmit({
            ...component,
            data: newCardList,
        });
    };

    return (
        <div className={styles.cardList}>
            {component.data?.map((item, index) => (
                <Card
                    key={index}
                    component={{ type: ComponentTypes.CARD, data: item }}
                    onSubmit={() => onCardClick(index)}
                />
            ))}
        </div>
    );
};

export default CardList;
