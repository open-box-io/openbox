import { Component, TextBoxComponent } from '@openbox/common';

import Button from '../../../../components/UI/Button/Button';
import React from 'react';
import styles from './submitButton.module.scss';

interface TextBoxProps {
    component: TextBoxComponent;
    onChange: (prop: Component) => void;
}

const SubmitButton = ({ component, onChange }: TextBoxProps): JSX.Element => {
    return (
        <Button onClick={() => onChange(component)}>
            {component.data || `Submit`}
        </Button>
    );
};

export default SubmitButton;
