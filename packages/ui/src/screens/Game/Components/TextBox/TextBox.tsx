import { Component, TextBoxComponent } from '@openbox/common';

import React from 'react';
import styles from './textBox.module.scss';

interface TextBoxProps {
    component: TextBoxComponent;
    onChange: (prop: Component) => void;
}

const TextBox = ({ component, onChange }: TextBoxProps): JSX.Element => {
    return (
        <input
            className={styles.Input}
            value={component.data}
            onChange={(event) =>
                onChange({ ...component, data: event.target.value })
            }
        />
    );
};

export default TextBox;
