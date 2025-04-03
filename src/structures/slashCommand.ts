import { CommandInteraction, PermissionsBitField } from 'discord.js';
import Client from '../client';
import { Localizer } from '../managers';

const flags = PermissionsBitField.Flags;
type PermFunction = (Perms: typeof flags) => bigint[];

interface Localizations {
    name_localizations: {
        'en-GB': string;
        'tr': string;
        [key: string]: string;
    };
    description_localizations: {
        'en-GB': string;
        'tr': string;
        [key: string]: string;
    };
};

interface Options extends Localizations {
    type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
    name: string;
    description: string;
    required?: boolean;
    choices?: {
        name: string;
        value: any
    }[];
    options?: Options[];
};

export interface SlashCommands extends Localizations {
    name: string;
    description: string;
    requireds?: {
        permissions?: PermFunction;
        owner?: boolean;
        vote?: boolean;
    };
    options?: Options[],
    run: (client: Client, interaction: CommandInteraction, locale: ReturnType<typeof Localizer>) => Promise<any> | any;
};