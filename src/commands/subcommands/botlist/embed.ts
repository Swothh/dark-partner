import { Commands } from '../../../structures';
import { Guild } from '../../../models';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { InteractionUtils, ModalUtils } from '../../../utils';

export const Embed: Commands['run'] = async (client, message, args, locale) => {
    let guild_db = await Guild.findOne({ guildId: message.guild.id }, { botlist: true });
    const components = [
        new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('botlist.customize-author')
                    .setLabel(locale('commands.botlist.customize.buttons_author'))
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(client.config.emojis.partner_text_image),
                new ButtonBuilder()
                    .setCustomId('botlist.customize-description')
                    .setLabel(locale('commands.botlist.customize.buttons_description'))
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(client.config.emojis.set_partner_text),
                new ButtonBuilder()
                    .setCustomId('botlist.customize-image')
                    .setLabel(locale('commands.botlist.customize.buttons_image'))
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(client.config.emojis.partner_text_author),
                new ButtonBuilder()
                    .setCustomId('botlist.customize-refresh')
                    .setLabel(locale('commands.botlist.customize.buttons_refresh'))
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(client.config.emojis.random_refresh)
            )
    ];

    const embed = new EmbedBuilder()
        .setColor(client.config.colors.main)
        .setAuthor({ name: `${locale('commands.botlist.customize.author')} — ${message.author.displayName}`, iconURL: message.author.avatarURL() })
        .setDescription(locale('commands.botlist.customize.description'))
        .addFields(locale('commands.botlist.customize.fields') as any);

    const msg = await message.channel.send({ embeds: [embed], components });
    const collector = client.managers.Collector({
        msg,
        channel: message.channel,
        componentType: ComponentType.Button,
        time: 60000,
        filter: i => i.user.id === i.user.id && i.message.id === msg.id,
    });

    collector.on('collect', async int => {
        if (!int.isButton()) return;

        const i = await InteractionUtils(client, int);

        if (int.customId === 'botlist.customize-author') {
            const create_modal = new client.managers.ModalManager(client, i);
            const modal = await create_modal.build(`botlist.customize.author_modal-${Math.floor(Math.random() * 1000)}`, {
                modal: new ModalBuilder()
                    .setTitle(locale('commands.botlist.customize.modals_title_1'))
                    .addComponents(
                        new ActionRowBuilder<TextInputBuilder>()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId('botlist.customize.author_modal.input')
                                    .setLabel(locale('commands.partner.text.modals.author_label'))
                                    .setPlaceholder(locale('commands.partner.text.modals.author_placeholder'))
                                    .setStyle(TextInputStyle.Short)
                                    .setMinLength(client.config.limits.author_min)
                                    .setMaxLength(client.config.limits.author)
                                    .setRequired(true)
                            )
                    )
            });

            const modal_interaction = await ModalUtils(client, modal);
            const author_value = modal.fields.getTextInputValue('botlist.customize.author_modal.input');

            await modal.deferReply({ ephemeral: true });
            await Guild.updateOne({ guildId: message.guild.id }, {
                $set: {
                    'botlist.embeds.author': author_value
                }
            }, { upsert: true });

            await modal_interaction.success(locale('commands.partner.text.modals.author_success'));
        };

        if (int.customId === 'botlist.customize-description') {
            const create_modal = new client.managers.ModalManager(client, i);
            const modal = await create_modal.build(`botlist.customize.description_modal-${Math.floor(Math.random() * 1000)}`, {
                modal: new ModalBuilder()
                    .setTitle(locale('commands.botlist.customize.modals_title_2'))
                    .addComponents(
                        new ActionRowBuilder<TextInputBuilder>()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId('botlist.customize.description_modal.input')
                                    .setLabel(locale('commands.botlist.customize.modals_label_2'))
                                    .setStyle(TextInputStyle.Paragraph)
                                    .setMaxLength(client.config.limits.partner_text_max)
                                    .setRequired(true)
                            )
                    )
            });

            const modal_interaction = await ModalUtils(client, modal);
            const description_value = modal.fields.getTextInputValue('botlist.customize.description_modal.input');

            await modal.deferReply({ ephemeral: true });
            await Guild.updateOne({ guildId: message.guild.id }, {
                $set: {
                    'botlist.embeds.description': description_value
                }
            }, { upsert: true });

            await modal_interaction.success(locale('commands.botlist.customize.description_success'));
        };

        if (int.customId === 'botlist.customize-image') {
            const create_modal = new client.managers.ModalManager(client, i);
            const modal = await create_modal.build(`botlist.customize.image_modal-${Math.floor(Math.random() * 1000)}`, {
                modal: new ModalBuilder()
                    .setTitle(locale('commands.botlist.customize.modals_title_3'))
                    .addComponents(
                        new ActionRowBuilder<TextInputBuilder>()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId('botlist.customize.image_modal.input')
                                    .setLabel(locale('commands.partner.text.modals.image_label'))
                                    .setPlaceholder(locale('commands.partner.text.modals.image_placeholder'))
                                    .setStyle(TextInputStyle.Short)
                                    .setRequired(true)
                            )
                    )
            });

            const modal_interaction = await ModalUtils(client, modal);
            const image_value = modal.fields.getTextInputValue('botlist.customize.image_modal.input');

            await modal.deferReply({ ephemeral: true });
            if (!image_value.startsWith('http://') && !image_value.startsWith('https://')) return await modal_interaction.error(locale('commands.partner.text.modals.image_error'));

            await Guild.updateOne({ guildId: message.guild.id }, {
                $set: {
                    'botlist.embeds.image': image_value
                }
            }, { upsert: true });

            await modal_interaction.success(locale('commands.partner.text.modals.image_success'));
        };

        if (int.customId === 'botlist.customize-refresh') {
            await int.deferReply({ ephemeral: true });

            const channel = message.guild.channels.cache.get(guild_db?.botlist.channel);
            if (!channel || !channel.isTextBased()) return await i.error(locale('commands.botlist.customize.refresh_error'));

            const msg = await channel.messages.fetch(guild_db?.botlist.message);
            if (!msg) return await i.error(locale('commands.botlist.customize.refresh_error'));

            guild_db = await Guild.findOne({ guildId: message.guild.id }, { botlist: true });
            const embed = new EmbedBuilder()
                .setFooter({ text: locale('commands.botlist.status.embeds.footer', { client: client.user.username }), iconURL: client.user.avatarURL() })
                .setTimestamp()
                .setColor(client.config.colors.main);

            if (guild_db?.botlist?.embeds?.author) embed.setAuthor({ name: guild_db?.botlist?.embeds?.author.replaceAll('{guild_name}', message.guild.name), iconURL: message.guild.iconURL() });
            else embed.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() });

            if (guild_db?.botlist?.embeds?.image) embed.setImage(guild_db?.botlist?.embeds?.image);
            if (guild_db?.botlist?.embeds?.description) embed.setDescription(guild_db?.botlist?.embeds?.description);
            else embed.setDescription(locale('commands.botlist.status.embeds.description_type_pin'));

            await msg.edit({ embeds: [embed] });
            await i.success(locale('commands.botlist.customize.refresh_success'));
        };
    });
};