import { IconLogoBackdrop } from '../../../assets/svgs/svgIconLogo/svgIconLogo';
import React from 'react';
import styles from './modal.module.scss';

interface ModalProps {
    center?: boolean;
    spaceEvenly?: boolean;
    children: JSX.Element | JSX.Element[];
    className?: string;
}

const Modal = (props: ModalProps): JSX.Element => {
    const styleArray = [styles.Modal, props.className];

    if (props.center) {
        styleArray.push(styles.justifyContentCenter);
    } else if (props.spaceEvenly) {
        styleArray.push(styles.justifyContentEvenly);
    }

    return (
        <div className={[...styleArray].join(` `)}>
            {props.children}
            <IconLogoBackdrop modal />
        </div>
    );
};

export default Modal;
