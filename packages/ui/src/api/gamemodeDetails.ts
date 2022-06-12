import { GamemodeSearchAPIResponse } from '@openbox/common';
import { openbox } from '../shared/axios';

export const searchGamemodeDetails = (
    searchText?: string,
): Promise<GamemodeSearchAPIResponse> =>
    new Promise((resolve, reject) => {
        const config = {
            headers: {
                'Content-Type': `application/json`,
                ...(searchText && { searchText }),
            },
        };

        openbox
            .get<GamemodeSearchAPIResponse>(`gamemode/search`, config)
            .then((response) => {
                resolve(response.data);
            })
            .catch(reject);
    });
