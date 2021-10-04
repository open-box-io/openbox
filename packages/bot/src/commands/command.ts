import { Command } from '../types/command';
import { ping } from './general/ping';
import { play } from './player/play';

export const commands = [ping, play];

export const getCommand = (commandName: string): Command | void =>
    commands.find((command) => command.command.name === commandName);
