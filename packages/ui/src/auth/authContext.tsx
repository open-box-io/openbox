import * as cognito from './cognito';

import {
    CognitoUserAttribute,
    CognitoUserSession,
} from 'amazon-cognito-identity-js';
import React, { useEffect, useState } from 'react';

import { useHistory } from 'react-router';

export enum AuthStatus {
    Loading,
    SignedIn,
    SignedOut,
}

export interface IAuth {
    sessionInfo: {
        username?: string;
        email?: string;
        sub?: string;
        accessToken?: string;
        refreshToken?: string;
    };
    attrInfo?: CognitoUserAttribute[];
    authStatus: AuthStatus;
    completeNewPassword: (nickname: string, password: string) => Promise<void>;
    signInWithEmail: (username: string, password: string) => Promise<void>;
    // signUpWithEmail: any;
    signOut: () => void;
    // verifyCode: any;
    getSession: () => Promise<CognitoUserSession | void>;
    // sendCode: any;
    // forgotPassword: any;
    changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
    getAttributes: () => Promise<CognitoUserAttribute[] | void>;
    // setAttribute: any;
}

const defaultState: IAuth = {
    sessionInfo: {},
    authStatus: AuthStatus.Loading,
    signInWithEmail: async () => undefined,
    signOut: async () => undefined,
    getSession: async () => undefined,
    changePassword: async () => undefined,
    getAttributes: async () => undefined,
    completeNewPassword: async () => undefined,
};

export const AuthContext = React.createContext(defaultState);

interface AuthProviderProps {
    children: JSX.Element | JSX.Element[];
}

const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
    const history = useHistory();

    const [authStatus, setAuthStatus] = useState(AuthStatus.Loading);
    const [sessionInfo, setSessionInfo] = useState({});
    const [attrInfo, setAttrInfo] = useState<CognitoUserAttribute[]>([]);

    useEffect(() => {
        const getSessionInfo = async () => {
            try {
                const session: any = await getSession();
                setSessionInfo({
                    accessToken: session.accessToken.jwtToken,
                    refreshToken: session.refreshToken.token,
                });
                window.localStorage.setItem(
                    `accessToken`,
                    `${session.accessToken.jwtToken}`,
                );
                window.localStorage.setItem(
                    `refreshToken`,
                    `${session.refreshToken.token}`,
                );

                const attr = await getAttributes();
                setAttrInfo(attr);
                setAuthStatus(AuthStatus.SignedIn);
            } catch (err) {
                setAuthStatus(AuthStatus.SignedOut);
            }
        };
        getSessionInfo();
    }, [setAuthStatus, authStatus]);

    async function signInWithEmail(username: string, password: string) {
        try {
            const status = await cognito.signInWithEmail(username, password);

            switch (status) {
            case cognito.LoginStatus.SUCCESS:
                setAuthStatus(AuthStatus.SignedIn);
                history.push(`/`);
                break;

            case cognito.LoginStatus.NEW_PASSWORD_REQUIRED:
                setAuthStatus(AuthStatus.SignedOut);
                history.push(`/newuserdetails`);
                break;

            case cognito.LoginStatus.MFA_REQUIRED:
            case cognito.LoginStatus.TOTP_REQUIRED:
            case cognito.LoginStatus.CUSTOM_REQUIRED:
            case cognito.LoginStatus.MFA_SETUP:
            case cognito.LoginStatus.SELECT_MFA_TYPE:
                setAuthStatus(AuthStatus.SignedOut);
            }
        } catch (err) {
            setAuthStatus(AuthStatus.SignedOut);
            throw err;
        }
    }

    async function completeNewPassword(nickname: string, password: string) {
        try {
            const status = await cognito.completeNewPassword(
                nickname,
                password,
            );

            switch (status) {
            case cognito.LoginStatus.SUCCESS:
                setAuthStatus(AuthStatus.SignedIn);
                history.push(`/`);
                break;

            case cognito.LoginStatus.MFA_REQUIRED:
            case cognito.LoginStatus.TOTP_REQUIRED:
            case cognito.LoginStatus.CUSTOM_REQUIRED:
            case cognito.LoginStatus.MFA_SETUP:
            case cognito.LoginStatus.SELECT_MFA_TYPE:
                setAuthStatus(AuthStatus.SignedOut);
            }
        } catch (err) {
            setAuthStatus(AuthStatus.SignedOut);
            throw err;
        }
    }

    // async function signUpWithEmail(
    //     username: string,
    //     email: string,
    //     password: string
    // ) {
    //     try {
    //         await cognito.signUpUserWithEmail(username, email, password);
    //     } catch (err) {
    //         throw err;
    //     }
    // }

    const signOut = () => {
        cognito.signOut();
        setAuthStatus(AuthStatus.SignedOut);
    };

    // async function verifyCode(username: string, code: string) {
    //     try {
    //         await cognito.verifyCode(username, code);
    //     } catch (err) {
    //         throw err;
    //     }
    // }

    const getSession = async () => {
        const session = await cognito.getSession();
        return session;
    };

    const getAttributes = async () => {
        const attr = await cognito.getAttributes();
        return attr;
    };

    // async function setAttribute(attr: any) {
    //     try {
    //         const res = await cognito.setAttribute(attr);
    //         return res;
    //     } catch (err) {
    //         throw err;
    //     }
    // }

    // async function sendCode(username: string) {
    //     try {
    //         await cognito.sendCode(username);
    //     } catch (err) {
    //         throw err;
    //     }
    // }

    // async function forgotPassword(
    //     username: string,
    //     code: string,
    //     password: string
    // ) {
    //     try {
    //         await cognito.forgotPassword(username, code, password);
    //     } catch (err) {
    //         throw err;
    //     }
    // }

    const changePassword = async (oldPassword: string, newPassword: string) => {
        await cognito.changePassword(oldPassword, newPassword);
    };

    const state: IAuth = {
        authStatus,
        sessionInfo,
        attrInfo,
        // signUpWithEmail,
        signInWithEmail,
        signOut,
        // verifyCode,
        getSession,
        // sendCode,
        // forgotPassword,
        changePassword,
        getAttributes,
        completeNewPassword,
    };

    return (
        <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;
