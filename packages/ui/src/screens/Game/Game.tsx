import {
    Component,
    ComponentTypes,
    LobbyResponse,
    PlayerResponse,
    PlayerView,
} from '@openbox/common';
import React, { useState } from 'react';

import SubmitButton from './Components/SubmitButton/SubmitButton';
import TextBox from './Components/TextBox/TextBox';

const GameComponents = {
    [ComponentTypes.SUBMIT_BUTTON]: SubmitButton,
    [ComponentTypes.TEXT_BOX]: TextBox,
    [ComponentTypes.CARD]: TextBox,
    [ComponentTypes.CARD_LIST]: TextBox,
};

interface GameProps {
    lobby: LobbyResponse;
    player: PlayerResponse;
    playerView: PlayerView;
    webSocket: WebSocket;
}

const Game = ({ lobby, player, playerView }: GameProps): JSX.Element => {
    const [viewProps, setViewProps] = useState(playerView.view);

    const isHost = player && lobby && player._id === lobby.host._id;

    const onPropChange = (index: number) => (prop: Component) => {
        if (prop.type === ComponentTypes.SUBMIT_BUTTON) {
            console.log(`submit`);
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
