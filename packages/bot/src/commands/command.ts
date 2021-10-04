import { SlashCommand } from 'slash-create';
import { back } from './player/back';
import { bassboost } from './player/bassboost';
import { clear } from './player/clear';
import { history } from './player/history';
import { jump } from './player/jump';
import { loop } from './player/loop';
import { np } from './player/np';
import { pause } from './player/pause';
import { ping } from './general/ping';
import { play } from './player/play';
import { playnext } from './player/playnext';
import { queue } from './player/queue';
import { remove } from './player/remove';
import { resume } from './player/resume';
import { seek } from './player/seek';
import { shuffle } from './player/shuffle';
import { skip } from './player/skip';
import { stop } from './player/stop';
import { volume } from './player/volume';

export const commands: typeof SlashCommand[] = [
    ping,
    back,
    bassboost,
    clear,
    history,
    jump,
    loop,
    np,
    pause,
    play,
    playnext,
    queue,
    remove,
    resume,
    seek,
    shuffle,
    skip,
    stop,
    volume,
];
