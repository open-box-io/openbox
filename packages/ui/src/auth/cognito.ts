import {
    AuthenticationDetails,
    CognitoUser,
    CognitoUserAttribute,
    CognitoUserPool,
    CognitoUserSession,
} from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: `eu-central-1_aTUl5v60U`,
    ClientId: `76lpmvr2m3jr83s7v5ibnp2k23`,
};

const userPool: CognitoUserPool = new CognitoUserPool(poolData);

let currentUser: CognitoUser | null = userPool.getCurrentUser();

export const getCurrentUser = (): CognitoUser => {
    return currentUser as CognitoUser;
};

const getCognitoUser = (username: string) => {
    const userData = {
        Username: username,
        Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);

    return cognitoUser;
};

export const getSession = async (): Promise<CognitoUserSession> => {
    if (!currentUser) {
        currentUser = userPool.getCurrentUser();
    }

    return new Promise<CognitoUserSession>((resolve, reject) => {
        currentUser?.getSession((err: unknown, session: CognitoUserSession) => {
            if (err) {
                reject(err);
            } else {
                resolve(session);
            }
        });
    }).catch((err) => {
        throw err;
    });
};

// export const signUpUserWithEmail = async (
//     username: string,
//     email: string,
//     password: string,
// ): Promise<ISignUpResult | undefined> => {
//     return new Promise<ISignUpResult | undefined>((resolve, reject) => {
//         const attributeList = [
//             new CognitoUserAttribute({
//                 Name: `email`,
//                 Value: email,
//             }),
//         ];

//         userPool.signUp(username, password, attributeList, [], (err, res) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(res);
//             }
//         });
//     }).catch((err) => {
//         throw err;
//     });
// };

// export async function verifyCode(username: string, code: string) {
//     return new Promise(function (resolve, reject) {
//         const cognitoUser = getCognitoUser(username);

//         cognitoUser.confirmRegistration(code, true, function (err, result) {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(result);
//             }
//         });
//     }).catch((err) => {
//         throw err;
//     });
// }

export enum LoginStatus {
    SUCCESS,
    NEW_PASSWORD_REQUIRED,
    MFA_REQUIRED,
    TOTP_REQUIRED,
    CUSTOM_REQUIRED,
    MFA_SETUP,
    SELECT_MFA_TYPE,
}

export const signInWithEmail = async (
    username: string,
    password: string,
): Promise<LoginStatus> => {
    return new Promise<LoginStatus>((resolve, reject) => {
        const authenticationData = {
            Username: username,
            Password: password,
        };
        const authenticationDetails = new AuthenticationDetails(
            authenticationData,
        );

        currentUser = getCognitoUser(username);

        currentUser.authenticateUser(authenticationDetails, {
            onFailure: (err) => {
                reject(err);
            },
            onSuccess: () => {
                resolve(LoginStatus.SUCCESS);
            },
            newPasswordRequired: () => {
                resolve(LoginStatus.NEW_PASSWORD_REQUIRED);
            },
            mfaRequired: () => {
                resolve(LoginStatus.MFA_REQUIRED);
            },
            totpRequired: () => {
                resolve(LoginStatus.TOTP_REQUIRED);
            },
            customChallenge: () => {
                resolve(LoginStatus.CUSTOM_REQUIRED);
            },
            mfaSetup: () => {
                resolve(LoginStatus.MFA_SETUP);
            },
            selectMFAType: () => {
                resolve(LoginStatus.SELECT_MFA_TYPE);
            },
        });
    }).catch((err) => {
        throw err;
    });
};

export const completeNewPassword = async (
    nickname: string,
    newPassword: string,
): Promise<LoginStatus> => {
    return new Promise<LoginStatus>((resolve, reject) => {
        currentUser?.completeNewPasswordChallenge(
            newPassword,
            { nickname },
            {
                onFailure: (err) => {
                    reject(err);
                },
                onSuccess: () => {
                    resolve(LoginStatus.SUCCESS);
                },
                newPasswordRequired: () => {
                    resolve(LoginStatus.NEW_PASSWORD_REQUIRED);
                },
                mfaRequired: () => {
                    resolve(LoginStatus.MFA_REQUIRED);
                },
                totpRequired: () => {
                    resolve(LoginStatus.TOTP_REQUIRED);
                },
                customChallenge: () => {
                    resolve(LoginStatus.CUSTOM_REQUIRED);
                },
                mfaSetup: () => {
                    resolve(LoginStatus.MFA_SETUP);
                },
                selectMFAType: () => {
                    resolve(LoginStatus.SELECT_MFA_TYPE);
                },
            },
        );
    }).catch((err) => {
        throw err;
    });
};

export const signOut = (): void => {
    if (currentUser) {
        currentUser.signOut();
    }
};

export const getAttributes = async (): Promise<CognitoUserAttribute[]> => {
    return new Promise<CognitoUserAttribute[]>((resolve, reject) => {
        currentUser?.getUserAttributes(
            (err: unknown, attributes?: CognitoUserAttribute[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(attributes || []);
                }
            },
        );
    }).catch((err) => {
        throw err;
    });
};

// export async function setAttribute(attribute: any) {
//     return new Promise(function (resolve, reject) {
//         const attributeList = [];
//         const res = new CognitoUserAttribute(attribute);
//         attributeList.push(res);

//         currentUser.updateAttributes(attributeList, (err: any, res: any) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(res);
//             }
//         });
//     }).catch((err) => {
//         throw err;
//     });
// }

// export async function sendCode(username: string) {
//     return new Promise(function (resolve, reject) {
//         const cognitoUser = getCognitoUser(username);

//         if (!cognitoUser) {
//             reject(`could not find ${username}`);
//             return;
//         }

//         cognitoUser.forgotPassword({
//             onSuccess: function (res) {
//                 resolve(res);
//             },
//             onFailure: function (err) {
//                 reject(err);
//             },
//         });
//     }).catch((err) => {
//         throw err;
//     });
// }

// export async function forgotPassword(
//     username: string,
//     code: string,
//     password: string,
// ) {
//     return new Promise(function (resolve, reject) {
//         const cognitoUser = getCognitoUser(username);

//         if (!cognitoUser) {
//             reject(`could not find ${username}`);
//             return;
//         }

//         cognitoUser.confirmPassword(code, password, {
//             onSuccess: function () {
//                 resolve(`password updated`);
//             },
//             onFailure: function (err) {
//                 reject(err);
//             },
//         });
//     });
// }

export const changePassword = async (
    oldPassword: string,
    newPassword: string,
): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        currentUser?.changePassword(
            oldPassword,
            newPassword,
            (err: unknown) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            },
        );
    });
};
