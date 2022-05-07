import React from 'react';
import { cssCombine } from '../../../shared/SCSS/scssHelpers';
import styles from './svgIconLogo.module.scss';

interface LogoProps {
    modal?: boolean;
}

export const IconLogo = (): JSX.Element => (
    <svg viewBox="0 0 320 253" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M319.928 53.0223C319.656 51.5689 318.629 50.3367 317.186 49.7314L199.692 0.392831C197.981 -0.326411 195.976 -0.0427853 194.572 1.11886L160 29.6687L125.428 1.11886C124.025 -0.0421067 122.019 -0.326411 120.309 0.392831L2.81349 49.7314C1.37203 50.3367 0.344391 51.5689 0.0716632 53.0223C-0.201065 54.4744 0.314573 55.959 1.44912 56.9863L38.5641 90.5749L17.6375 125.048C16.3423 127.183 17.1408 129.893 19.4244 131.108L39.7619 141.938V186.226C39.7619 187.815 40.6696 189.284 42.143 190.079L157.611 252.401C158.351 252.8 159.175 253 160.001 253C160.788 253 161.575 252.813 162.289 252.449L162.282 252.459L277.857 190.079C279.331 189.285 280.238 187.816 280.238 186.227V141.938L300.577 131.109C302.861 129.894 303.659 127.184 302.363 125.049L281.437 90.5756L318.551 56.987C319.686 55.959 320.202 54.4744 319.928 53.0223ZM202.627 122.135L164.771 101.676V42.8349L265.229 89.9547L202.627 122.135ZM54.7714 89.9554L155.231 42.8349V101.676L117.373 122.135L54.7714 89.9554ZM13.1364 55.1597L121.412 9.69276L151.561 34.5887L45.4201 84.3751L13.1364 55.1597ZM28.2848 125.576L46.3605 95.7975L152.841 150.531L129.217 179.319L28.2848 125.576ZM155.229 240.83L49.3038 183.658V147.019L128.106 188.979C128.849 189.374 129.662 189.564 130.468 189.564C131.911 189.564 133.328 188.954 134.26 187.818L155.23 162.266L155.229 240.83ZM160 144.047L127.13 127.151L160 109.387L192.87 127.151L160 144.047ZM270.696 183.658L164.771 240.83V162.265L185.741 187.818C186.671 188.953 188.089 189.564 189.533 189.564C190.337 189.564 191.152 189.374 191.895 188.978L270.696 147.018V183.658ZM291.716 125.576L190.784 179.318L167.159 150.53L273.64 95.7968L291.716 125.576ZM274.581 84.3751L168.439 34.5887L198.586 9.69276L306.864 55.1597L274.581 84.3751Z"
            fill="white"
        />
    </svg>
);

export const IconLogoBackdrop = (props: LogoProps): JSX.Element => {
    const styleArray = [styles.OpenBoxIcon];

    if (props.modal) {
        styleArray.push(styles.Modal);
    }

    return (
        <svg
            className={cssCombine(
                styles.OpenBoxIcon,
                props.modal && styles.Modal,
            )}
            viewBox="0 0 683 596"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M681.999 314.206C681.999 306.898 681.999 195.898 681.999 187.204L682 40L589.089 1.14868C584.043 -0.954458 578.128 -0.125109 573.985 3.27166L471.999 86.7543L370.013 3.27166C365.872 -0.123125 359.955 -0.954458 354.911 1.14868L8.29977 145.42C4.04748 147.19 1.01595 150.793 0.211406 155.043C-0.59314 159.289 0.927988 163.63 4.2749 166.634L113.764 264.85L52.0306 365.654C48.2095 371.896 50.5652 379.82 57.3019 383.374L117.297 415.04V544.544C117.297 549.19 119.975 553.486 124.322 555.809L198 595H254C405.5 595 459.001 595 457.927 595C460.25 595 483.5 595.102 486.073 595L682 491V477L681.999 461.44C682.048 479.13 682 477 682 491V477L681.999 461.44V343.93C681.999 333.398 681.999 324.898 681.999 314.206C681.999 328 681.999 321.898 681.999 314.206ZM597.748 357.134L486.073 297.312V125.254L681.999 216.347V314.206L597.748 357.134ZM161.575 263.039L457.929 125.254V297.312L346.25 357.134L161.575 263.039ZM38.7523 161.293L358.165 28.3426L447.103 101.141L133.989 246.722L38.7523 161.293ZM83.44 367.198L136.763 280.122L450.879 440.169L381.188 524.348L83.44 367.198ZM457.927 595H419.5H377.912H254L145.446 537.036V429.899L377.912 552.593C380.103 553.75 382.501 554.305 384.881 554.305C389.135 554.305 393.317 552.52 396.067 549.2L457.927 474.481V595ZM471.999 421.209L375.033 371.803L471.999 319.859L568.965 371.803L471.999 421.209ZM681.999 461.44L682 477V491L486.073 595V474.479L547.933 549.198C550.679 552.518 554.861 554.303 559.119 554.303C561.492 554.303 563.897 553.748 566.088 552.591L682 491V476.995L681.999 461.44ZM681.999 345.398V461.44L562.812 524.346L493.119 440.167L681.999 343.93V314.206V345.398ZM681.999 187.204L496.895 101.141L585.828 28.3426L682 68L681.999 187.204Z"
                fill={`white`}
            />
        </svg>
    );
};
