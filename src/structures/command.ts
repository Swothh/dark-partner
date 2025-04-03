import { Message, PermissionsBitField } from 'discord.js';
import { Localizer } from '../managers';
import Dark from '../client';

const flags = PermissionsBitField.Flags;
type PermBitField = (Perms: typeof flags) => bigint[];

export interface Commands {
    name: string;
    description?: string;
    aliases?: string[];
    category?: string;
    cooldown?: number;
    requireds?: {
        permissions?: PermBitField;
        owner?: boolean;
        vote?: boolean;
    };
    run: (client: Dark, message: Message, args: string[], localize?: ReturnType<typeof Localizer>) => Promise<any> | any;
};