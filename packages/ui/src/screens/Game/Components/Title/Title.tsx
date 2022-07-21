import {
    Component,
    TitleComponent,
} from '@openbox/common/src/types/componentTypes';

import { GameComponents } from '../../Game';
import React from 'react';
import styles from './title.module.scss';

interface TitleProps {
    component: TitleComponent;
    onSubmit: (prop: Component) => void;
    onChange: (prop: Component) => void;
}

const Title = ({ component, onSubmit, onChange }: TitleProps): JSX.Element => {
    const onChildSubmit = (child: Component) => {
        onSubmit({
            ...component,
            child,
        });
    };

    const onChildChange = (child: Component) => {
        onChange({
            ...component,
            child,
        });
    };

    const child = GameComponents[component.child.type]({
        component: component.child as any,
        onChange: onChildChange,
        onSubmit: onChildSubmit,
    });

    return (
        <div className={styles.layout}>
            {component.data.title && (
                <div className={styles.title}>{component.data.title}</div>
            )}
            {component.data.description && (
                <div className={styles.description}>
                    {component.data.description}
                </div>
            )}
            {child}
        </div>
    );
};

export default Title;
