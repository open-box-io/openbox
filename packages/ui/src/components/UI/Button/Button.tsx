import React from 'react';
import styles from './button.module.scss';

interface ButtonProps {
    clicked: React.MouseEventHandler<HTMLButtonElement>;
    styling: string;
    children: JSX.Element | string;
}

function Button(props: ButtonProps): JSX.Element {
    return (
        <button onClick={props.clicked} className={styles[props.styling]}>
            <p>{props.children}</p>
        </button>
    );
}
export default Button;
