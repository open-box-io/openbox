import { Guild } from 'discord.js';
import { Message } from 'slash-create';

export interface PlayerInstance {
    guild: Guild;
    message: Message;
}
