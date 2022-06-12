import { GamemodeDetails, RequestDataLocation } from '@openbox/common';

import { Request } from 'express';
import { createGamemode } from '../../helpers/gamemode';
import { getAuthorizedUserData } from '../../helpers/auth';
import { getRequestData } from '../../helpers/requestValidation';
import uuid from 'uuid-random';

export const putGamemode = async (request: Request): Promise<void> => {
    console.log(`PUT /gamemode`, request);

    const {
        authorization,
        id,
        name,
        description,
        githubUser,
        githubRepo,
        approvedVersion,
    } = getRequestData<{
        authorization: string;
        id?: string;
        name: string;
        description: string;
        githubUser: string;
        githubRepo: string;
        approvedVersion?: string;
    }>(request, [
        {
            location: RequestDataLocation.HEADERS,
            name: `authorization`,
            type: `string`,
            required: true,
            minLength: 3,
            maxLength: 100,
        },
        {
            location: RequestDataLocation.BODY,
            name: `id`,
            type: `string`,
        },
        {
            location: RequestDataLocation.BODY,
            name: `name`,
            type: `string`,
            required: true,
            minLength: 3,
            maxLength: 100,
        },
        {
            location: RequestDataLocation.BODY,
            name: `description`,
            type: `string`,
            required: true,
        },
        {
            location: RequestDataLocation.BODY,
            name: `githubUser`,
            type: `string`,
            required: true,
        },
        {
            location: RequestDataLocation.BODY,
            name: `githubRepo`,
            type: `string`,
            required: true,
        },
        {
            location: RequestDataLocation.BODY,
            name: `approvedVersion`,
            type: `string`,
        },
    ]);

    const user = getAuthorizedUserData(authorization);

    console.log({
        id,
        user,
        name,
        description,
        githubUser,
        githubRepo,
        approvedVersion,
    });

    const gamemode: GamemodeDetails = {
        _id: uuid(),

        name: name,
        description: description,
        author: user._id,
        githubUser: githubUser,
        githubRepo: githubRepo,
    };

    await createGamemode(gamemode);
};
