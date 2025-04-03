import { CommandInteraction, EmbedBuilder, Message } from 'discord.js';
import { Map } from '../interfaces';
import Minigame from '../index';
import { Localizer } from 'src/managers';

type MessageFunction = (minigame: Minigame) => EmbedBuilder;
type EndFunction = (minigame: Minigame) => Promise<any> | any;

export interface Options {
    locale: ReturnType<typeof Localizer>;
    map: Map;
    message: Message;
    loading_message?: Message;
    kill_count?: number;
    messages?: {
        finish?: MessageFunction;
        death?: MessageFunction;
        exit?: MessageFunction;
    };
    on?: {
        finish?: EndFunction;
        death?: EndFunction;
        exit?: EndFunction;
    };
    funcs: {
        save: (kills: number, map: Map) => void;
        delete: () => Promise<void>;
    };
};