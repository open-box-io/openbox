import React, { useCallback } from 'react';
import styles from './confirmInput.module.scss';

interface InputProps {
    label: string;
    type?: string;
    initialValue: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onConfirm: (text: string) => undefined;
}

const ConfirmInput = (props: InputProps): JSX.Element => {
    const [text, setText] = React.useState<string>(props.initialValue);

    const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
        (event) => {
            setText(event.target.value);
            onChange && onChange(event);
        },
        [setText],
    );

    return (
        <div>
            <label className={styles.Label}>{props.label}</label>
            <input
                type={props.type || `text`}
                value={text}
                onChange={onChange}
                className={styles.Input}
            />
            {text === props.initialValue ? null : (
                <>
                    <button>y</button>
                    <button>n</button>
                </>
            )}
        </div>
    );
};

export default ConfirmInput;
