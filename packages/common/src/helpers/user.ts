import { APIError } from '../types/errorTypes';
import AWS from 'aws-sdk';
import { User } from '../types/userTypes';
import dotenv from 'dotenv';

export const getUserById = async (id: string): Promise<User> =>
    new Promise((resolve, reject) => {
        dotenv.config();

        const cog = new AWS.CognitoIdentityServiceProvider();

        const req = {
            Filter: `sub = "${id}"`,
            UserPoolId: process.env.USER_POOL_ID || ``,
        };

        cog.listUsers(req, (err, data) => {
            if (err || data?.Users?.length !== 1) {
                console.log({ err, data });
                return reject(new APIError(500, `Could not find user`));
            }

            const user = data.Users[0];
            const nickname
                = user.Attributes?.find(
                    (attribute) => attribute.Name === `nickname`,
                )?.Value || ``;

            resolve({
                _id: id,
                nickname,
            });
        });
    });
