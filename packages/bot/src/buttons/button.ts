import { ButtonInteraction, Interaction } from 'discord.js';

import { back } from './player/back';
import { like } from './player/like';
import { loop } from './player/loop';
import { pause } from './player/pause';
import { play } from './player/play';
import { shuffle } from './player/shuffle';
import { skip } from './player/skip';
import { unlike } from './player/unlike';

export interface Button {
    name: string;
    run: (interaction: Interaction) => void;
}

export const buttons: Button[] = [
    back,
    like,
    loop,
    pause,
    play,
    shuffle,
    skip,
    unlike,
];

export const getButton = (name: string): Button | undefined =>
    buttons.find((button) => button.name === name);

export const clickButton = (interaction: ButtonInteraction): void =>
    getButton(interaction.customId)?.run(interaction);
