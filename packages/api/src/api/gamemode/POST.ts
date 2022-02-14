import { APIError, Phase, RequestDataLocation } from '@openbox/common';
import {
    createNewGamemode,
    updateGamemodeLatestVersion,
} from '../../helpers/gamemode';

import { GameVerificationState } from '../../../../common/src/types/gamemodeTypes';
import { Request } from 'express';
import { getAuthorizedUserData } from '../../helpers/auth';
import { getRequestData } from '../../helpers/requestValidation';

export const postGamemode = async (request: Request): Promise<void> => {
    console.log(`POST /gamemode`, request);

    const {
        authorization,
        id,
        name,
        initialPhaseName,
        initialGameState,
        phases,
    } = getRequestData<{
        authorization: string;
        id?: string;
        name?: string;
        initialPhaseName: string;
        initialGameState?: string;
        phases: Phase[];
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
            minLength: 3,
            maxLength: 100,
        },
        {
            location: RequestDataLocation.BODY,
            name: `initialPhaseName`,
            type: `string`,
            required: true,
        },
        {
            location: RequestDataLocation.BODY,
            name: `initialGameState`,
            type: `string`,
        },
        {
            location: RequestDataLocation.BODY,
            name: `phases`,
            type: `object`,
            required: true,
        },
    ]);

    const user = getAuthorizedUserData(authorization);

    console.log({
        user,
        id,
        name,
        initialPhaseName,
        initialGameState,
        phases,
    });

    const version = {
        verified: GameVerificationState.UNVERIFIED,

        initialPhaseName: initialPhaseName,
        initialGameState: initialGameState || ``,

        phases: phases,
    };

    if (id) {
        const gamemode = updateGamemodeLatestVersion(id, version);
        console.log({ gamemode });
    } else if (name) {
        const gamemode = createNewGamemode(name, user, version);
        console.log({ gamemode });
    } else {
        throw new APIError(400, `No name or id provided`);
    }
};
