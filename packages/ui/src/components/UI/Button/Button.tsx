import React from 'react';
import styles from './button.module.scss';

interface ButtonProps {
    clicked: React.MouseEventHandler<HTMLButtonElement>;
    text?: boolean;
    children: JSX.Element | string;
    submit?: boolean;
}

function Button(props: ButtonProps): JSX.Element {
    return (
        <button
            onClick={props.clicked}
            className={styles[props.text ? `Text` : `Default`]}
            type={`submit` || undefined}
        >
            <p>{props.children}</p>
        </button>
    );
}
export default Button;
