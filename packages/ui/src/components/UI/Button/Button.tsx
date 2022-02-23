import React from 'react';
import styles from './button.module.scss';

export enum BUTTON_STYLE {
    DEFAULT = `Default`,
    WARNING = `Warning`,
    TEXT = `Text`,
}

interface ButtonProps {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    style?: BUTTON_STYLE;
    children: JSX.Element | string;
    submit?: boolean;
}

function Button(props: ButtonProps): JSX.Element {
    return (
        <button
            onClick={props.onClick}
            className={styles[props.style || BUTTON_STYLE.DEFAULT]}
            type={`submit` || undefined}
        >
            <div>{props.children}</div>
        </button>
    );
}
export default Button;
