import {
    Component,
    ComponentTypes,
    PlayerView,
} from '@openbox/common/src/types/componentTypes';
import React, { useEffect, useState } from 'react';

import Card from './Components/Card/Card';
import CardList from './Components/CardList/CardList';
import { LobbyResponse } from '@openbox/common/src/types/lobbyTypes';
import { PlayerResponse } from '@openbox/common/src/types/playerTypes';
import SubmitButton from './Components/SubmitButton/SubmitButton';
import TextBox from './Components/TextBox/TextBox';
import { WebsocketActionType } from '@openbox/common/src/types/websocketTypes';
import styles from './game.module.scss';

const GameComponents = {
    [ComponentTypes.SUBMIT_BUTTON]: SubmitButton,
    [ComponentTypes.TEXT_BOX]: TextBox,
    [ComponentTypes.CARD]: Card,
    [ComponentTypes.CARD_LIST]: CardList,
};

interface GameProps {
    lobby: LobbyResponse;
    player: PlayerResponse;
    playerView: PlayerView;
    webSocket: WebSocket;
}

const Game = ({
    lobby,
    player,
    playerView,
    webSocket,
}: GameProps): JSX.Element => {
    const [viewProps, setViewProps] = useState(playerView.view);

    useEffect(() => setViewProps(playerView.view), [playerView.view]);

    const isHost = player && lobby && player._id === lobby.host._id;

    const onPropSubmit = (index: number) => (prop: Component) => {
        const newProps = [...viewProps];
        newProps[index] = prop;

        setViewProps(newProps);

        webSocket?.send(
            JSON.stringify({
                recipientId: lobby.host._id,
                message: {
                    action: {
                        type: WebsocketActionType.GAME_SUBMIT,
                    },
                    component: index,
                    playerView: {
                        ...playerView,
                        view: newProps,
                    },
                },
            }),
        );
    };

    const onPropChange = (index: number) => (prop: Component) => {
        setViewProps((viewProps) => {
            const newProps = [...viewProps];
            newProps[index] = prop;

            return newProps;
        });
    };

    return (
        <section className={styles.game}>
            {viewProps.map((prop, index) =>
                GameComponents[prop.type]({
                    component: prop as any,
                    onChange: onPropChange(index),
                    onSubmit: onPropSubmit(index),
                }),
            )}
        </section>
    );
};

export default Game;
