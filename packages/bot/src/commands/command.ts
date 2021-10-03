import { Command } from '../types/command';
import { ping } from './general/ping';

export const commands = [ping];

export const getCommand = (commandName: string): Command | void =>
    commands.find((command) => command.command.name === commandName);
