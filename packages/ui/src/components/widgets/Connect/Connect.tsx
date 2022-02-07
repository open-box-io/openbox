import React, { useCallback, useState } from 'react';

import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import { JoinLobbyAPIResponse } from '@openbox/common';
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

    connect: (player: string, lobby: string) => Promise<JoinLobbyAPIResponse>;
    back?: () => void;
}

const Connect = ({
    connectionType,
    lobbyIdentifier,
    connect,
    back,
}: ConnectProps): JSX.Element => {
    // [ Two user inputs, players name and lobby id  ]
    const [player, setPlayer] = useState<TextboxProps>({
        value: ``,
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

    const history = useHistory();

    // curried function
    // returns a changeEventHandler function when passed a setState function
    const onChangeHandler
        = (setState: React.Dispatch<React.SetStateAction<TextboxProps>>) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                setState((prevState) => {
                    console.log(`changedState`, prevState, event.target.value);
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

        console.log(player, lobbyId);

        connect(player.value, lobbyId.value)
            .then((response) => {
                setLoading(false);
                history.push(`/lobby/${response.lobby._id}`);
            })
            .catch((err) => {
                setLoading(false);
                setErrorMessage(`${err}`);
            });
    }, [setLoading, setErrorMessage, player, lobbyId]);

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
                    <Button styling={`Default`} clicked={onSubmit}>
                        {connectionType.toUpperCase()}
                    </Button>
                    {!back ? null : (
                        <Button styling={`Back`} clicked={back}>
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
