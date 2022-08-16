import Button, { BUTTON_STYLE } from '../../UI/Button/Button';
import React, { useCallback, useContext, useState } from 'react';

import { AuthContext } from '../../../auth/authContext';
import Input from '../../UI/Input/Input';
import { JoinLobbyAPIResponse } from '@openbox/common/src/types/endpointTypes';
import styles from './connect.module.scss';
import { useHistory } from 'react-router-dom';

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

    const showLobbyId = !lobbyIdentifier && connectionType !== `host`;
    const nickname = authContext.attrInfo?.find(
        (att) => att.Name === `nickname`,
    );

    const [player, setPlayer] = useState<string>(nickname?.Value || ``);
    const [lobbyId, setLobbyId] = useState<string>(lobbyIdentifier || ``);

    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>();

    const onChangeHandler
        = (setState: React.Dispatch<React.SetStateAction<string>>) =>
            (event: React.ChangeEvent<HTMLInputElement>) => {
                if (event.target.value.length > 15) {
                    setErrorMessage(`Player name is too long`);
                } else if (
                    event.target.value.length < 3
                && event.target.value < player
                ) {
                    setErrorMessage(`Player name is too short`);
                } else {
                    setErrorMessage(undefined);
                }
                setState(event.target.value);
            };

    const onSubmit = useCallback(async () => {
        if (showLobbyId && !lobbyId) {
            return setErrorMessage(`Missing Lobby Code`);
        }
        if (player.length > 15) {
            return setErrorMessage(`Player name is too long`);
        }
        if (player.length < 3) {
            return setErrorMessage(`Player name is too short`);
        }

        setErrorMessage(undefined);
        setLoading(true);

        connect(player, lobbyId);
    }, [showLobbyId, lobbyId, player, connect]);

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
                            value={player}
                            onChange={onChangeHandler(setPlayer)}
                        ></Input>
                        {showLobbyId ? (
                            <Input
                                type="text"
                                label="Room Code"
                                value={lobbyId}
                                onChange={onChangeHandler(setLobbyId)}
                            ></Input>
                        ) : null}
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
