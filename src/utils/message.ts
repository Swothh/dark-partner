import { EmbedBuilder, Message } from 'discord.js';
import DarkPartner from '../client';
import { User } from '../models';

export const MessageUtils = async (client: DarkPartner, message: Message) => {
    const embed = new EmbedBuilder();
    const userDb = await User.findOne({ user: message.author.id }, { locale: 1, _id: 0 });
    let locale = client.locales.get(userDb?.locale ?? client.config.main.default_locale);

    message.success = async (msg, options = {}) => {
        embed.setColor('White')
        embed.setTitle(locale.__._global.success_title)
        embed.setAuthor({ name: `${message.author.displayName} — ${locale.__._global.success}`, iconURL: message.author.displayAvatarURL() })
        embed.setDescription('<a:check_gif:1205931146203103234> **|** ' + msg)
        embed.setFooter({ text: `©️ ${new Date().getFullYear()} Dark`, iconURL: client.user.avatarURL() })
        embed.setTimestamp()
        /*embed.setFooter({ text: locale.__._global.success_occured, iconURL: client.config.icons.success })
        embed.setTimestamp()*/

        return await (options?.edit || message)[options?.edit ? 'edit' : 'nmReply']({
            embeds: [embed],
            components: options?.components ?? [],
        });
    };

    message.error = async (msg, options) => {
        embed.setColor('White')
        embed.setTitle(locale.__._global.error_title)
        embed.setAuthor({ name: `${message.author.displayName} — ${locale.__._global.error}`, iconURL: message.author.displayAvatarURL() })
        embed.setDescription('<a:cross_gif:1205931180197675159> **|** ' + msg)
        /*embed.setFooter({ text: locale.__._global.error_occured, iconURL: client.config.icons.error })
        embed.setTimestamp();*/
        embed.setFooter({ text: `©️ ${new Date().getFullYear()} Dark`, iconURL: client.user.avatarURL() })
        embed.setTimestamp()

        if (options?.image) embed.setImage(options.image);

        return await (options?.edit || message)[options?.edit ? 'edit' : 'nmReply']({
            embeds: [embed],
            components: options?.components ?? [],
        });
    };

    message.sendTask = async (task, difficulty, prize, options) => {
        let icon: string;
        if (difficulty === 1) icon = client.config.icons.task_1;
        if (difficulty === 2) icon = client.config.icons.task_2;
        if (difficulty === 3) icon = client.config.icons.task_3;

        embed.setColor('Blue')
        embed.setAuthor({ name: `${locale.__._global.task} — ${message.author.displayName}`, iconURL: message.author.displayAvatarURL() })
        embed.setDescription(locale.__.commands.tasks.messages[task as keyof typeof locale.__.commands.tasks.messages].replace('{amount}', String(prize)))
        embed.setThumbnail(icon)
        embed.setFooter({ text: locale.__._global.task_occured, iconURL: client.config.icons.info })
        embed.setTimestamp();

        return await (options?.edit || message)[options?.edit ? 'edit' : 'nmReply']({
            embeds: [embed],
            components: options?.components ?? [],
        });
    };

    message.nmReply = async (object): Promise<Message> => {
        return await message.reply({
            ...(object ?? {}),
            allowedMentions: { repliedUser: false },
        }).catch(() => null);
    };

    return message;
};