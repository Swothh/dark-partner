import * as cmd from './subcommands';
import { Commands } from '../structures';
import { Guild } from '../models';

export const Command: Commands = {
    name: 'partner',
    description: 'Partner komutları',
    aliases: ['p'],
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
            'yetkilisi': 'Staff',
            'sorumlu': 'Staff',
            'sorumlusu': 'Staff',
            'text': 'Text',
            'yazı': 'Text',
            'yazi': 'Text',
            'metin': 'Text',
            'metni': 'Text',
            'status': 'Status',
            'durum': 'Status',
            'durumu': 'Status',
            'aç': 'Status',
            'ac': 'Status',
            'açık': 'Status',
            'acik': 'Status',
            'kapat': 'Status',
            'kapalı': 'Status',
            'kapali': 'Status',
            'karaliste': 'Blacklist',
            'kara-liste': 'Blacklist',
            'kara-listesi': 'Blacklist',
            'karalist': 'Blacklist',
            'blacklist': 'Blacklist',
            'send': 'Send',
            'gonder': 'Send',
            'gönder': 'Send',
            'ol': 'Send',
            'oluştur': 'Send',
            'olustur': 'Send',
            'random': 'Random',
            'rastgele': 'Random',
            'rastgele-gönder': 'Random',
            'rastgele-ol': 'Random',
            'rastgeleol': 'Random',
            'must': 'Must',
            'zorunlu': 'Must',
            'şart': 'Must',
            'data': 'Data',
            'veri': 'Data',
            'url': 'Url',
            'bul': 'Find',
            'ara': 'Find',
            'find': 'Find',
            'search': 'Find',
            'analiz': 'Analysis',
            'analysis': 'Analysis',
            'yetkililer': 'Analysis',
            'erişim': 'Access',
            'access': 'Access',
        };

        const p = message.member.permissions.has('Administrator');
        const r = message.member.roles.cache.has(g?.partner?.staff) || g?.partner?.access?.includes(message.author.id);
        if (!p && !r) return message.error(locale('events.partner.permission_error', { role: g?.partner?.staff }));

        const func = obj[shift as keyof typeof obj];
        if (!func) return message.error(locale('commands.partner.all_commands'));
        return cmd[func as keyof typeof cmd](client, message, args, locale);
    }
};