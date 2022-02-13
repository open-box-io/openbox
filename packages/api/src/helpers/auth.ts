import { User } from '@openbox/common';
import jwt_decode from 'jwt-decode';

export const getAuthorizedUserData = (authorization: string): User => {
    const decoded: { sub: string; nickname: string }
        = jwt_decode(authorization);

    return {
        _id: decoded.sub,
        nickname: decoded.nickname,
    };
};
