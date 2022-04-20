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
import { getHeaders } from '../../store/store';

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

    const onPropChange = (index: number) => (prop: Component) => {
        if (prop.type === ComponentTypes.SUBMIT_BUTTON) {
            const headers = getHeaders();

            webSocket?.send(
                JSON.stringify({
                    lobbyId: headers.lobbyId,
                    playerId: headers.playerId,
                    secret: headers.secret,
                    recipientId: lobby.host._id,
                    message: {
                        action: {
                            type: WebsocketActionType.GAME_SUBMIT,
                        },
                        playerView,
                    },
                }),
            );
        } else {
            setViewProps((viewProps) => {
                viewProps[index] = prop;
                return viewProps;
            });
        }
    };

    const view = viewProps.map((prop, index) =>
        GameComponents[prop.type]({
            component: prop as any,
            onChange: onPropChange(index),
        }),
    );

    return <>{view}</>;
};

export default Game;
