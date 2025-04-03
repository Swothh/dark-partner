import { CommandInteraction, EmbedBuilder, Message } from 'discord.js';
import Minigame from '../index';
import { Localizer } from '../../../managers';

type MessageFunction = (minigame: Minigame) => EmbedBuilder;
type EndFunction = (minigame: Minigame) => Promise<any> | any;

export interface Options {
    message: Message;
    locale: ReturnType<typeof Localizer>;
    man?: {
        hat: string;
        head: string;
        shirt: string;
        pants: string;
        feets: string;
    };
    funcs?: {
        delete?: () => Promise<void>;
        finish?: (w: string, reason: string, letters: string[]) => Promise<void>;
    },
    words: string[];
};