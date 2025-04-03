import { EmbedBuilder } from 'discord.js';
import { Commands } from '../../structures';
import { User } from '../../models';

export const Command: Commands = {
    name: 'language',
    description: 'dil deis',
    aliases: ['dil', 'lang'],
    category: 'user',
    cooldown: 5000,
    run: async (client, message, args, locale) => {
        const db = await User.findOne({ user: message.author.id }, { locale: true });
        const [lang] = args;
        const langs = ['tr', 'en'];

        if (!lang) return message.error(locale('commands.language.no_lang', { languages: langs.join(', ') }));
        if (!langs.includes(lang)) return message.error(locale('commands.language.no_lang', { languages: langs.join(', ') }));
        if (db?.locale === lang) return message.error(locale('commands.language.same_lang'));

        await User.updateOne({ user: message.author.id }, { locale: lang }, { upsert: true });
        await message.success(locale('commands.language.success', { language: lang }));
    }
};