import { Commands } from '../../structures';
import { Guild } from '../../models';
import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { ModalUtils } from '../../utils';

export const Text: Commands['run'] = async (client, message, args, locale) => {
    let guild = await Guild.findOne({ guildId: message.guild.id });

    const msg = await message.nmReply({
        embeds: [
            new EmbedBuilder()
                .setColor(client.config.colors.main)
                .setAuthor({ name: `${locale('commands.partner.text.author')} — ${message.author.username}`, iconURL: message.author.avatarURL() })
                .setFooter({ text: locale('commands.partner.text.footer'), iconURL: client.config.icons.paint })
                .setTimestamp()
                .setDescription(locale('commands.partner.text.description'))
                .addFields(locale('commands.partner.text.fields') as any)
        ],
        components: [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('partnertext.set')
                        .setLabel(locale('commands.partner.text.set'))
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(client.config.emojis.set_partner_text),
                    new ButtonBuilder()
                        .setCustomId('partnertext.customize')
                        .setLabel(locale('commands.partner.text.customize'))
                        .setStyle(ButtonStyle.Success)
                        .setEmoji(client.config.emojis.customize_partner_text)
                )
        ]
    });


    const collector = client.managers.Collector({
        msg,
        channel: message.channel,
        componentType: ComponentType.Button,
        time: 60000,
        filter: i => i.user.id === message.author.id && i.message.id === msg.id,
    });

    collector.on('collect', async i => {
        if (!i.isButton()) return;

        if (i.customId === 'partnertext.set') {
            const create_modal = new client.managers.ModalManager(client, i);
            const modal = await create_modal.build(`partnertext.set_modal-${Math.floor(Math.random() * 1000)}`, {
                modal: new ModalBuilder()
                    .setTitle(locale('commands.partner.text.modals.title'))
                    .addComponents(
                        new ActionRowBuilder<TextInputBuilder>()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId('partnertext.set_modal.input')
                                    .setLabel(locale('commands.partner.text.modals.label'))
                                    .setPlaceholder(locale('commands.partner.text.modals.placeholder'))
                                    .setStyle(TextInputStyle.Paragraph)
                                    .setMinLength(client.config.limits.partner_text_min)
                                    .setMaxLength(client.config.limits.partner_text_max)
                                    .setRequired(true)
                            )
                    )
            });

            const value = modal.fields.getTextInputValue('partnertext.set_modal.input');
            await modal.deferReply({ ephemeral: true });

            await Guild.updateOne({ guildId: message.guild.id }, {
                $set: {
                    'partner.text': value
                }
            }, { upsert: true });

            const modal_interaction = await ModalUtils(client, modal);
            const regex = /(https:\/\/)?(www\.)?(((discord(app)?)?\.com\/invite)|((discord(app)?)?\.gg))\/(?<invite>.+)/gm;
            if (value.match(regex) === null) return await modal_interaction.error(locale('commands.partner.text.modals.link_error'));

            const lines = value.split('\n');
            const length = value.length;
            const words = value.split(' ');

            await modal_interaction.success(locale('commands.partner.text.modals.success', { length: length.toString(), words: words.length.toString(), lines: lines.length.toString() }));
        };


        if (i.customId === 'partnertext.customize') {
            const components = [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('partnertext.customize-author')
                            .setLabel(locale('commands.partner.text.buttons_author'))
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(client.config.emojis.partner_text_author),
                        new ButtonBuilder()
                            .setCustomId('partnertext.customize-image')
                            .setLabel(locale('commands.partner.text.buttons_image'))
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(client.config.emojis.partner_text_image),
                        new ButtonBuilder()
                            .setCustomId('partnertext.customize-thumbnail')
                            .setLabel(locale('commands.partner.text.buttons_thumbnail'))
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(client.config.emojis.partner_text_thumbnail),
                        new ButtonBuilder()
                            .setCustomId('partnertext.customize-back')
                            .setLabel(locale('commands.partner.text.buttons_back'))
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(client.config.emojis.back)
                    ),
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('partnertext.customize-button')
                            .setLabel(locale('commands.partner.text.buttons_join_button'))
                            .setStyle(guild?.partner?.embeds?.joinButton ? ButtonStyle.Danger : ButtonStyle.Success)
                            .setEmoji(guild?.partner?.embeds?.joinButton ? client.config.emojis.cross : client.config.emojis.tick),
                        new ButtonBuilder()
                            .setCustomId('partnertext.customize-status')
                            .setLabel(guild?.partner?.embeds?.status ? locale('commands.partner.text.buttons_status_button_disabled') : locale('commands.partner.text.buttons_status_button'))
                            .setStyle(guild?.partner?.embeds?.status ? ButtonStyle.Danger : ButtonStyle.Success)
                            .setEmoji(guild?.partner?.embeds?.status ? client.config.emojis.cross : client.config.emojis.tick)
                    )
            ];

            await i.update({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.colors.main)
                        .setAuthor({ name: `${locale('commands.partner.text.author_customize')} — ${message.author.displayName}`, iconURL: message.author.avatarURL() })
                        .setFooter({ text: locale('commands.partner.text.footer_customize'), iconURL: client.config.icons.paint })
                        .setTimestamp()
                        .setDescription(locale('commands.partner.text.description_customize'))
                        .addFields(locale('commands.partner.text.customize_fields') as any)
                ],
                components: components
            });
        };


        if (i.customId === 'partnertext.customize-button') {
            guild = await Guild.findOne({ guildId: message.guild.id });

            await Guild.updateOne({ guildId: message.guild.id }, {
                $set: {
                    'partner.embeds.joinButton': !guild.partner?.embeds?.joinButton
                }
            }, { upsert: true });

            const components = [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('partnertext.customize-author')
                            .setLabel(locale('commands.partner.text.buttons_author'))
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(client.config.emojis.partner_text_author),
                        new ButtonBuilder()
                            .setCustomId('partnertext.customize-image')
                            .setLabel(locale('commands.partner.text.buttons_image'))
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(client.config.emojis.partner_text_image),
                        new ButtonBuilder()
                            .setCustomId('partnertext.customize-thumbnail')
                            .setLabel(locale('commands.partner.text.buttons_thumbnail'))
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(client.config.emojis.partner_text_thumbnail),
                        new ButtonBuilder()
                            .setCustomId('partnertext.customize-back')
                            .setLabel(locale('commands.partner.text.buttons_back'))
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(client.config.emojis.back)
                    ),
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('partnertext.customize-button')
                            .setLabel(locale('commands.partner.text.buttons_join_button'))
                            .setStyle(!guild.partner?.embeds?.joinButton ? ButtonStyle.Danger : ButtonStyle.Success)
                            .setEmoji(!guild.partner?.embeds?.joinButton ? client.config.emojis.cross : client.config.emojis.tick),
                        new ButtonBuilder()
                            .setCustomId('partnertext.customize-status')
                            .setLabel(guild.partner?.embeds?.status ? locale('commands.partner.text.buttons_status_button_disabled') : locale('commands.partner.text.buttons_status_button'))
                            .setStyle(guild.partner?.embeds?.status ? ButtonStyle.Danger : ButtonStyle.Success)
                            .setEmoji(guild.partner?.embeds?.status ? client.config.emojis.cross : client.config.emojis.tick)
                    )
            ];

            await i.update({
                components: components
            });
        };

        if (i.customId === 'partnertext.customize-status') {
            guild = await Guild.findOne({ guildId: message.guild.id });

            await Guild.updateOne({ guildId: message.guild.id }, {
                $set: {
                    'partner.embeds.status': !guild.partner?.embeds?.status
                }
            }, { upsert: true });

            const components = [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('partnertext.customize-author')
                            .setLabel(locale('commands.partner.text.buttons_author'))
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(client.config.emojis.partner_text_author),
                        new ButtonBuilder()
                            .setCustomId('partnertext.customize-image')
                            .setLabel(locale('commands.partner.text.buttons_image'))
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(client.config.emojis.partner_text_image),
                        new ButtonBuilder()
                            .setCustomId('partnertext.customize-thumbnail')
                            .setLabel(locale('commands.partner.text.buttons_thumbnail'))
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(client.config.emojis.partner_text_thumbnail),
                        new ButtonBuilder()
                            .setCustomId('partnertext.customize-back')
                            .setLabel(locale('commands.partner.text.buttons_back'))
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(client.config.emojis.back)
                    ),
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('partnertext.customize-button')
                            .setLabel(locale('commands.partner.text.buttons_join_button'))
                            .setStyle(guild.partner?.embeds?.joinButton ? ButtonStyle.Danger : ButtonStyle.Success)
                            .setEmoji(guild.partner?.embeds?.joinButton ? client.config.emojis.cross : client.config.emojis.tick),
                        new ButtonBuilder()
                            .setCustomId('partnertext.customize-status')
                            .setLabel(!guild.partner?.embeds?.status ? locale('commands.partner.text.buttons_status_button_disabled') : locale('commands.partner.text.buttons_status_button'))
                            .setStyle(!guild.partner?.embeds?.status ? ButtonStyle.Danger : ButtonStyle.Success)
                            .setEmoji(!guild.partner?.embeds?.status ? client.config.emojis.cross : client.config.emojis.tick)
                    )
            ];

            await i.update({
                components: components
            });
        };


        if (i.customId === 'partnertext.customize-author') {
            const create_modal = new client.managers.ModalManager(client, i);
            const modal = await create_modal.build(`partnertext.customize.author_modal-${Math.floor(Math.random() * 1000)}`, {
                modal: new ModalBuilder()
                    .setTitle(locale('commands.partner.text.modals.title_2'))
                    .addComponents(
                        new ActionRowBuilder<TextInputBuilder>()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId('partnertext.customize.author_modal.input')
                                    .setLabel(locale('commands.partner.text.modals.author_label'))
                                    .setPlaceholder(locale('commands.partner.text.modals.author_placeholder'))
                                    .setStyle(TextInputStyle.Short)
                                    .setMinLength(client.config.limits.author_min)
                                    .setMaxLength(client.config.limits.author)
                                    .setRequired(true)
                            ),
                        new ActionRowBuilder<TextInputBuilder>()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId('partnertext.customize.author_icon_modal.input')
                                    .setLabel(locale('commands.partner.text.modals.author_icon_label'))
                                    .setPlaceholder(locale('commands.partner.text.modals.author_icon_placeholder'))
                                    .setStyle(TextInputStyle.Short)
                                    .setRequired(false)
                            )
                    )
            });

            const modal_interaction = await ModalUtils(client, modal);
            const author_value = modal.fields.getTextInputValue('partnertext.customize.author_modal.input');
            const author_icon_value = modal.fields.getTextInputValue('partnertext.customize.author_icon_modal.input');
            await modal.deferReply({ ephemeral: true });

            if (author_icon_value && author_icon_value !== '{guild_icon}' && !author_icon_value.startsWith('http://') && !author_icon_value.startsWith('https://')) return await modal_interaction.error(locale('commands.partner.text.modals.author_icon_error'));
            await Guild.updateOne({ guildId: message.guild.id }, {
                $set: {
                    'partner.embeds.author.name': author_value,
                    'partner.embeds.author.icon': !modal.fields.getTextInputValue('partnertext.customize.author_icon_modal.input') ? guild?.partner?.embeds?.author?.icon ?? null : modal.fields.getTextInputValue('partnertext.customize.author_icon_modal.input')
                }
            }, { upsert: true });

            await modal_interaction.success(locale('commands.partner.text.modals.author_success'));
        };


        if (i.customId === 'partnertext.customize-image') {
            const create_modal = new client.managers.ModalManager(client, i);
            const modal = await create_modal.build(`partnertext.customize.image_modal-${Math.floor(Math.random() * 1000)}`, {
                modal: new ModalBuilder()
                    .setTitle(locale('commands.partner.text.modals.title_2'))
                    .addComponents(
                        new ActionRowBuilder<TextInputBuilder>()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId('partnertext.customize.image_modal.input')
                                    .setLabel(locale('commands.partner.text.modals.image_label'))
                                    .setPlaceholder(locale('commands.partner.text.modals.image_placeholder'))
                                    .setStyle(TextInputStyle.Short)
                                    .setRequired(true)
                            )
                    )
            });

            const modal_interaction = await ModalUtils(client, modal);
            const image_value = modal.fields.getTextInputValue('partnertext.customize.image_modal.input');
            await modal.deferReply({ ephemeral: true });

            if (!image_value.startsWith('http://') && !image_value.startsWith('https://')) return await modal_interaction.error(locale('commands.partner.text.modals.image_error'));
            await Guild.updateOne({ guildId: message.guild.id }, {
                $set: {
                    'partner.embeds.image': image_value
                }
            }, { upsert: true });

            await modal_interaction.success(locale('commands.partner.text.modals.image_success'));
        };


        if (i.customId === 'partnertext.customize-thumbnail') {
            const create_modal = new client.managers.ModalManager(client, i);
            const modal = await create_modal.build(`partnertext.customize.thumbnail_modal-${Math.floor(Math.random() * 1000)}`, {
                modal: new ModalBuilder()
                    .setTitle(locale('commands.partner.text.modals.title_2'))
                    .addComponents(
                        new ActionRowBuilder<TextInputBuilder>()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId('partnertext.customize.thumbnail_modal.input')
                                    .setLabel(locale('commands.partner.text.modals.thumbnail_label'))
                                    .setPlaceholder(locale('commands.partner.text.modals.thumbnail_placeholder'))
                                    .setStyle(TextInputStyle.Short)
                                    .setRequired(true)
                            )
                    )
            });

            const modal_interaction = await ModalUtils(client, modal);
            const thumbnail_value = modal.fields.getTextInputValue('partnertext.customize.thumbnail_modal.input');
            await modal.deferReply({ ephemeral: true });

            if (!thumbnail_value.startsWith('http://') && !thumbnail_value.startsWith('https://')) return await modal_interaction.error(locale('commands.partner.text.modals.thumbnail_error'));
            await Guild.updateOne({ guildId: message.guild.id }, {
                $set: {
                    'partner.embeds.thumbnail': thumbnail_value
                }
            }, { upsert: true });

            await modal_interaction.success(locale('commands.partner.text.modals.thumbnail_success'));
        };


        if (i.customId === 'partnertext.customize-back') {
            await i.update({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.colors.main)
                        .setAuthor({ name: `${locale('commands.partner.text.author')} — ${message.author.username}`, iconURL: message.author.avatarURL() })
                        .setFooter({ text: locale('commands.partner.text.footer'), iconURL: client.config.icons.paint })
                        .setTimestamp()
                        .setDescription(locale('commands.partner.text.description'))
                        .addFields(locale('commands.partner.text.fields') as any)
                ],
                components: [
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('partnertext.set')
                                .setLabel(locale('commands.partner.text.set'))
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji(client.config.emojis.set_partner_text),
                            new ButtonBuilder()
                                .setCustomId('partnertext.customize')
                                .setLabel(locale('commands.partner.text.customize'))
                                .setStyle(ButtonStyle.Success)
                                .setEmoji(client.config.emojis.customize_partner_text)
                        )
                ]
            });
        };

    });
};