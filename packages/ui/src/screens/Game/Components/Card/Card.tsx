import {
    CardComponent,
    Component,
} from '@openbox/common/src/types/componentTypes';

import React from 'react';
import { cssCombine } from '../../../../shared/SCSS/scssHelpers';
import styles from './card.module.scss';

interface CardProps {
    component: CardComponent;
    onSubmit: (prop: Component) => void;
}

const Card = ({ component, onSubmit }: CardProps): JSX.Element => {
    return (
        <div
            className={cssCombine(
                styles.card,
                component.data.selected && styles.selected,
            )}
            onClick={() => {
                onSubmit({
                    ...component,
                    data: {
                        ...component.data,
                        selected: !component.data.selected,
                    },
                });
            }}
        >
            <div className={styles.content}>{component.data.text}</div>
        </div>
    );
};

export default Card;
