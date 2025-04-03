import { ClientEvents } from 'discord.js';
import Client from '../client';

export interface Events {
    name: keyof ClientEvents;
    on: 'once' | 'on';
    run: (client: Client, ...args: any) => Promise<any> | any;
};