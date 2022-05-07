import { Component, TextBoxComponent } from '@openbox/common';

import Button from '../../../../components/UI/Button/Button';
import React from 'react';
import styles from './submitButton.module.scss';

interface SubmitButtonProps {
    component: TextBoxComponent;
    onSubmit: (prop: Component) => void;
}

const SubmitButton = ({
    component,
    onSubmit,
}: SubmitButtonProps): JSX.Element => {
    return (
        <Button onClick={() => onSubmit(component)}>
            {component.data || `Submit`}
        </Button>
    );
};

export default SubmitButton;
