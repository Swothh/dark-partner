import { EmbedBuilder, ModalSubmitInteraction } from 'discord.js';
import DarkPartner from '../client';
import { User } from '../models';

export const ModalUtils = async (client: DarkPartner, modal: ModalSubmitInteraction, d?: boolean) => {
    const embed = new EmbedBuilder();
    const userDb = await User.findOne({ user: modal.user.id }, { locale: 1, _id: 0 });
    let locale = client.locales.get(userDb?.locale ?? client.config.main.default_locale);

    modal.success = async (msg, options = {}) => {
        embed.setColor(client.config.colors.success)
        embed.setAuthor({ name: `${locale.__._global.success} — ${modal.user.displayName}`, iconURL: modal.user.displayAvatarURL() })
        embed.setDescription(msg)
        embed.setFooter({ text: locale.__._global.success_occured, iconURL: client.config.icons.success })
        embed.setTimestamp()

        return d ? await modal.reply({
            embeds: [embed],
            ephemeral: true,
            components: options?.components ?? [],
        }) : await modal.followUp({
            embeds: [embed],
            components: options?.components ?? [],
        });
    };

    modal.error = async (msg, options) => {
        embed.setColor(client.config.colors.error)
        embed.setAuthor({ name: `${locale.__._global.error} — ${modal.user.displayName}`, iconURL: modal.user.displayAvatarURL() })
        embed.setDescription(msg)
        embed.addFields({
            name: locale.__._global.error_fields,
            value: locale.__._global.error_fields_desc
        })
        embed.setFooter({ text: locale.__._global.error_occured, iconURL: client.config.icons.error })
        embed.setTimestamp();

        if (options?.image) embed.setImage(options.image);

        return d ? await modal.reply({
            embeds: [embed],
            ephemeral: true,
            components: options?.components ?? [],
        }) : await modal.followUp({
            embeds: [embed],
            components: options?.components ?? [],
        });
    };

    return modal;
};