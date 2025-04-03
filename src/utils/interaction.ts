import { EmbedBuilder, ButtonInteraction, StringSelectMenuInteraction, CommandInteraction } from 'discord.js';
import DarkPartner from '../client';
import { User } from '../models';

export const InteractionUtils = async (client: DarkPartner, interaction: ButtonInteraction | StringSelectMenuInteraction | CommandInteraction, transaction?: string) => {
    const embed = new EmbedBuilder();
    const userDb = await User.findOne({ user: interaction.user.id }, { locale: 1, _id: 0 });
    let locale = client.locales.get(userDb?.locale ?? client.config.main.default_locale);

    interaction.success = async (msg, options = {}) => {
        embed.setColor('White')
        embed.setTitle(locale.__._global.success_title)
        embed.setAuthor({ name: `${interaction.user.displayName} — ${locale.__._global.success}`, iconURL: interaction.user.displayAvatarURL() })
        embed.setDescription('<a:check_gif:1205931146203103234> **|** ' + msg)
        embed.setFooter({ text: `©️ ${new Date().getFullYear()} Dark`, iconURL: client.user.avatarURL() })
        embed.setTimestamp()
        /*embed.setFooter({ text: locale.__._global.success_occured, iconURL: client.config.icons.success })
        embed.setTimestamp()*/

        if (transaction === 'deny') await interaction.reply({
            embeds: [embed],
            components: options?.components ?? [],
            ephemeral: true
        });
        else await interaction.followUp({
            embeds: [embed],
            components: options?.components ?? [],
        });
    };

    interaction.error = async (msg, options) => {
        embed.setColor('White')
        embed.setTitle(locale.__._global.error_title)
        embed.setAuthor({ name: `${interaction.user.displayName} — ${locale.__._global.error}`, iconURL: interaction.user.displayAvatarURL() })
        embed.setDescription('<a:cross_gif:1205931180197675159> **|** ' + msg)
        /*embed.setFooter({ text: locale.__._global.error_occured, iconURL: client.config.icons.error })
        embed.setTimestamp();*/
        embed.setFooter({ text: `©️ ${new Date().getFullYear()} Dark`, iconURL: client.user.avatarURL() })
        embed.setTimestamp()

        if (options?.image) embed.setImage(options.image);

        if (transaction === 'deny') await interaction.reply({
            embeds: [embed],
            components: options?.components ?? [],
            ephemeral: true
        });
        else await interaction.followUp({
            embeds: [embed],
            components: options?.components ?? [],
        });
    };

    interaction.sendError = async (msg, options) => {
        embed.setColor('Red')
        embed.setAuthor({ name: `${locale.__._global.error} — ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
        embed.setDescription(msg)
        embed.addFields({
            name: locale.__._global.error_fields,
            value: locale.__._global.error_fields_desc
        })
        embed.setFooter({ text: locale.__._global.error_occured, iconURL: client.config.icons.error })
        embed.setTimestamp();

        if (options?.image) embed.setImage(options.image);

        if (transaction === 'deny') await interaction.reply({
            embeds: [embed],
            components: options?.components ?? [],
            ephemeral: true
        });
        else await interaction.followUp({
            embeds: [embed],
            components: options?.components ?? [],
        });
    };

    return interaction;
};