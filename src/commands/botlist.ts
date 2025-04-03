import * as cmd from './subcommands/botlist';
import { Commands } from '../structures';
import { Guild } from '../models';

export const Command: Commands = {
    name: 'botlist',
    description: 'Botlist komutları',
    aliases: ['bl'],
    category: 'bot',
    cooldown: 5000,
    run: async (client, message, args, locale) => {
        const g = await Guild.findOne({ guildId: message.guild.id }, { partner: true });
        const shift = args.shift();

        const obj = {
            'kanal': 'Channel',
            'channel': 'Channel',
            'log': 'Log',
            'kayıt': 'Log',
            'kayit': 'Log',
            'staff': 'Staff',
            'yetkili': 'Staff',
            'yetkililer': 'Staff',
            'yetkilisi': 'Staff',
            'sorumlu': 'Staff',
            'sorumlusu': 'Staff',
            'must': 'Must',
            'zorunlu': 'Must',
            'zorunlusu': 'Must',
            'şart': 'Must',
            'durum': 'Status',
            'status': 'Status',
            'type': 'Type',
            'tür': 'Type',
            'embed': 'Embed',
            'özelleştir': 'Embed',
            'ozellestir': 'Embed',
            'özelleştirme': 'Embed',
            'ozellestirme': 'Embed',
            'customize': 'Embed',
            'mesaj': 'Embed',
            'otorol': 'AutoRole',
            'otorole': 'AutoRole',
            'autorole': 'AutoRole',
            'kontrol': 'Check',
            'check': 'Check'
        };

        const p = message.member.permissions.has('Administrator');
        const r = message.member.roles.cache.has(g?.botlist?.staff);
        if (!p && !r) return message.error(locale('events.partner.permission_error', { role: g?.partner?.staff }));

        const func = obj[shift as keyof typeof obj];
        if (!func) return message.error(locale('commands.botlist.all_commands'));
        return cmd[func as keyof typeof cmd](client, message, args, locale);
    }
};