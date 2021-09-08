import { ValidationHeaders } from '@openbox/common';

export const getHeaders = (): ValidationHeaders =>
    JSON.parse(localStorage.getItem(`headers`) as string);

export const setHeaders = (headers: ValidationHeaders): void => {
    localStorage.setItem(`headers`, JSON.stringify(headers));
};
