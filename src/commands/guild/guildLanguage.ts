import { EmbedBuilder } from 'discord.js';
import { Commands } from '../../structures';
import { Guild } from '../../models';

export const Command: Commands = {
    name: 'guild-language',
    description: 'dil deis',
    aliases: ['sunucu-dili', 'sunucu-dil', 'guild-lang', 'guild-language'],
    category: 'user',
    cooldown: 5000,
    requireds: {
        permissions(Perms) {
            return [Perms.ManageGuild];
        },
    },
    run: async (client, message, args, locale) => {
        const db = await Guild.findOne({ guildId: message.guild.id }, { locale: true });
        const [lang] = args;
        const langs = ['tr', 'en'];

        if (!lang) return message.error(locale('commands.language.no_lang', { languages: langs.join(', ') }));
        if (!langs.includes(lang)) return message.error(locale('commands.language.no_lang', { languages: langs.join(', ') }));
        if (db?.locale === lang) return message.error(locale('commands.language.same_lang'));

        await Guild.updateOne({ guildId: message.guild.id }, { locale: lang }, { upsert: true });
        await message.success(locale('commands.language.success', { language: lang }));
    }
};