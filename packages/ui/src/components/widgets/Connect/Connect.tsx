import Button, { BUTTON_STYLE } from '../../UI/Button/Button';
import React, { useCallback, useContext, useState } from 'react';

import { AuthContext } from '../../../auth/authContext';
import Input from '../../UI/Input/Input';
import { JoinLobbyAPIResponse } from '@openbox/common/src/types/endpointTypes';
import styles from './connect.module.scss';
import { useHistory } from 'react-router-dom';

interface TextboxProps {
    value: string;
    rules: {
        required: boolean;
        minLength: number;
        maxLength: number;
    };
}

interface ConnectProps {
    connectionType: string;
    lobbyIdentifier?: string;

    connect: (player: string, lobby: string) => void;
    back?: () => void;
}

const Connect = ({
    connectionType,
    lobbyIdentifier,
    connect,
    back,
}: ConnectProps): JSX.Element => {
    const authContext = useContext(AuthContext);

    const nickname = authContext.attrInfo?.find(
        (att) => att.Name === `nickname`,
    );

    // [ Two user inputs, players name and lobby id  ]
    const [player, setPlayer] = useState<TextboxProps>({
        value: nickname?.Value || ``,
        rules: {
            // [ Validation rules ]
            required: true,
            minLength: 3,
            maxLength: 12,
        },
    });

    const [lobbyId, setLobbyId] = useState<TextboxProps>({
        value: lobbyIdentifier || ``,
        rules: {
            // [ Validation rules ]
            required: true,
            minLength: 4,
            maxLength: 4,
        },
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>();

    // curried function
    // returns a changeEventHandler function when passed a setState function
    const onChangeHandler
        = (setState: React.Dispatch<React.SetStateAction<TextboxProps>>) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setState((prevState) => {
                    return {
                        value: event.target.value,
                        rules: {
                            ...prevState.rules,
                        },
                    };
                });
            };

    const onSubmit = useCallback(async () => {
        setLoading(true);

        connect(player.value, lobbyId.value);
    }, [connect, player.value, lobbyId.value]);

    return (
        <div className={styles.Join}>
            {loading ? (
                <p>Loading</p>
            ) : (
                <>
                    <form onSubmit={onSubmit}>
                        <Input
                            type="text"
                            label="Nickname"
                            value={player.value}
                            onChange={onChangeHandler(setPlayer)}
                        ></Input>
                        {lobbyIdentifier || connectionType === `host` ? null : (
                            <Input
                                type="text"
                                label="Room Code"
                                value={lobbyId.value}
                                onChange={onChangeHandler(setLobbyId)}
                            ></Input>
                        )}
                    </form>
                    <Button onClick={onSubmit}>
                        {connectionType.toUpperCase()}
                    </Button>
                    {!back ? null : (
                        <Button style={BUTTON_STYLE.TEXT} onClick={back}>
                            back
                        </Button>
                    )}
                    <p>{errorMessage}</p>
                </>
            )}
        </div>
    );
};

export default Connect;
