import {
    RequestDataLocation,
    RequestDataSelector,
} from '../types/endpointTypes';

import { APIError } from '../types/errorTypes';

export const getRequestData = <T extends Record<string, unknown>>(
    request: any,
    selectors: RequestDataSelector[],
): T => {
    const allData: Record<string, unknown> = {};

    selectors.forEach((selector) => {
        const name
            = selector.location === RequestDataLocation.HEADERS ?
                selector.name.toLowerCase()
                : selector.name;
        const data = request[selector.location]?.[name];

        if (!data && selector.required) {
            throw new APIError(400, `No ${name} provided.`);
        }

        if (!data && !selector.required) {
            return;
        }

        if (typeof data !== selector.type) {
            throw new APIError(
                400,
                `Invalid ${data}, should be ${selector.type}.`,
            );
        }

        if (
            selector.minLength
            && typeof data === `string`
            && data.length < selector.minLength
        ) {
            throw new APIError(
                400,
                `${selector.name} must be at least ${selector.minLength} characters long.`,
            );
        }

        if (
            selector.maxLength
            && typeof data === `string`
            && data.length > selector.maxLength
        ) {
            throw new APIError(
                400,
                `${name} must be fewer than ${selector.maxLength} characters long.`,
            );
        }

        allData[selector.name] = data;
    });

    return allData as T;
};
