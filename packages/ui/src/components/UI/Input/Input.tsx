import React from 'react';
import styles from './input.module.scss';

interface InputProps {
    label: string;
    type?: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const Input = (props: InputProps): JSX.Element => {
    return (
        <div>
            <label className={styles.Label}>{props.label}</label>
            <input
                type={props.type}
                value={props.value}
                onChange={props.onChange}
                className={styles.Input}
            />
        </div>
    );
};

export default Input;
