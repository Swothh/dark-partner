import { Commands } from '../../../structures';
import { Guild } from '../../../models';
import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType, ChannelType, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export const Status: Commands['run'] = async (client, message, args, locale) => {
    const db = await Guild.findOne({ guildId: message.guild.id });

    if (db?.botlist?.status === 0 || !db?.botlist?.status) {
        if (!db || !db?.botlist?.channel || !db?.botlist?.staff || !db?.botlist?.log) {
            const not_set = {
                channel: !db?.botlist?.channel ? locale('commands.botlist.status.channel') : '',
                staff: !db?.botlist?.staff ? locale('commands.botlist.status.staff') : '',
                log: !db?.botlist?.log ? locale('commands.botlist.status.log') : ''
            };

            return message.error(locale('commands.botlist.status.not_set', {
                not_set: Object.values(not_set).filter(x => x).join(', ')
            }));
        };

        const msg = await message.nmReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.colors.main)
                    .setAuthor({ name: `${locale('commands.botlist.type.author')} — ${message.author.displayName}`, iconURL: message.author.avatarURL() })
                    .setDescription(locale('commands.botlist.status.select_description'))
                    .addFields(locale('commands.botlist.type.fields') as any)
                    .setFooter({ text: locale('commands.botlist.type.footer'), iconURL: client.config.icons.paint })
                    .setTimestamp()
            ],
            components: [
                new ActionRowBuilder<StringSelectMenuBuilder>()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('botlist.type')
                            .setPlaceholder(locale('commands.botlist.type.placeholder'))
                            .addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setLabel(locale('commands.botlist.type.options_1_label'))
                                    .setDescription(locale('commands.botlist.type.options_1_description'))
                                    .setValue('command')
                                    .setDefault(db?.botlist?.addType === 1 ? true : false)
                                    .setEmoji(client.config.emojis.set_botlist_type_command),
                                new StringSelectMenuOptionBuilder()
                                    .setLabel(locale('commands.botlist.type.options_2_label'))
                                    .setDescription(locale('commands.botlist.type.options_2_description'))
                                    .setValue('form')
                                    .setDefault(db?.botlist?.addType === 2 ? true : false)
                                    .setEmoji(client.config.emojis.set_botlist_type_form),
                                new StringSelectMenuOptionBuilder()
                                    .setLabel(locale('commands.botlist.type.options_3_label'))
                                    .setDescription(locale('commands.botlist.type.options_3_description'))
                                    .setValue('pin')
                                    .setDefault(db?.botlist?.addType === 3 ? true : false)
                                    .setEmoji(client.config.emojis.lock),
                            )
                    )
            ]
        });

        const collector = client.managers.Collector({
            msg,
            channel: message.channel,
            componentType: ComponentType.StringSelect,
            time: 60000,
            filter: i => i.user.id === message.author.id && i.message.id === msg.id
        });

        collector.on('collect', async i => {
            if (!i.isStringSelectMenu()) return;

            const v = i.values[0] === 'command' ? 1 : i.values[0] === 'form' ? 2 : 3;
            if (v === 3) {
                const create_modal = new client.managers.ModalManager(client, i);
                const modal = await create_modal.build(`botlist.pin_modal-${Math.floor(Math.random() * 1000)}`, {
                    modal: new ModalBuilder()
                        .setTitle(locale('commands.botlist.status.modals.title'))
                        .addComponents(
                            new ActionRowBuilder<TextInputBuilder>()
                                .addComponents(
                                    new TextInputBuilder()
                                        .setCustomId('botlist.set_pin.input')
                                        .setLabel(locale('commands.botlist.status.modals.label'))
                                        .setPlaceholder('darkpartnerv6')
                                        .setStyle(TextInputStyle.Short)
                                        .setMinLength(client.config.limits.botlist_pin_min)
                                        .setMaxLength(client.config.limits.botlist_pin_max)
                                        .setRequired(true)
                                )
                        )
                });

                const pin = modal.fields.getTextInputValue('botlist.set_pin.input');
                await modal.deferUpdate();

                const embed = new EmbedBuilder()
                    .setFooter({ text: locale('commands.botlist.status.embeds.footer', { client: client.user.username }), iconURL: client.user.avatarURL() })
                    .setTimestamp()
                    .setColor(client.config.colors.main);

                if (db?.botlist?.embeds?.author) embed.setAuthor({ name: db?.botlist?.embeds?.author, iconURL: message.guild.iconURL() });
                else embed.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() });

                if (db?.botlist?.embeds?.image) embed.setImage(db?.botlist?.embeds?.image);
                if (db?.botlist?.embeds?.description) embed.setDescription(db?.botlist?.embeds?.description);
                else embed.setDescription(locale('commands.botlist.status.embeds.description_type_pin'));

                const channel = message.guild.channels.cache.get(db?.botlist?.channel);
                if (!channel || channel.type !== ChannelType.GuildText) {
                    await i.update({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.config.colors.error)
                                .setAuthor({ name: `${locale('_global.error')} — ${message.author.displayName}`, iconURL: message.author.displayAvatarURL() })
                                .setDescription(locale('commands.botlist.status.channel_not_found_error'))
                                .setFooter({ text: locale('_global.error_occured'), iconURL: client.config.icons.success })
                                .setTimestamp()
                        ],
                        components: []
                    });

                    return collector.stop();
                };

                await channel.send({
                    embeds: [embed],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`botlist.add_bot_pin-${message.guild.id}-${Math.random().toString(36).substring(2)}`)
                                    .setLabel(locale('commands.botlist.status.add_bot_button'))
                                    .setStyle(ButtonStyle.Secondary)
                            )
                    ]
                });

                await Guild.updateOne({ guildId: message.guild.id }, { $set: { 'botlist.addType': v, 'botlist.status': 1, 'botlist.pin': pin } }, { upsert: true });
                await i.message.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.config.colors.success)
                            .setAuthor({ name: `${locale('_global.success')} — ${message.author.displayName}`, iconURL: message.author.displayAvatarURL() })
                            .setDescription(locale('commands.botlist.status.success_enable'))
                            .addFields((locale as any)('commands.botlist.status.success_enable_fields').map((x: any) => ({
                                name: x.name,
                                value: x.value.replaceAll('{type}', locale('commands.botlist.type.options_3_label'))
                            })))
                            .setFooter({ text: locale('_global.success_occured'), iconURL: client.config.icons.success })
                            .setTimestamp()
                    ],
                    components: []
                });

                return collector.stop();
            };

            const embed = new EmbedBuilder()
                .setFooter({ text: locale('commands.botlist.status.embeds.footer', { client: client.user.username }), iconURL: client.user.avatarURL() })
                .setTimestamp()
                .setColor(client.config.colors.main);

            if (db?.botlist?.embeds?.author) embed.setAuthor({ name: db?.botlist?.embeds?.author, iconURL: message.guild.iconURL() });
            else embed.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() });

            if (db?.botlist?.embeds?.image) embed.setImage(db?.botlist?.embeds?.image);
            if (db?.botlist?.embeds?.description) embed.setDescription(db?.botlist?.embeds?.description);
            else embed.setDescription(v === 1 ? locale('commands.botlist.status.embeds.description_type_command') : v === 2 ? locale('commands.botlist.status.embeds.description_type_button') : locale('commands.botlist.status.embeds.description_type_pin'));

            const channel = message.guild.channels.cache.get(db?.botlist?.channel);
            if (!channel || channel.type !== ChannelType.GuildText) {
                await i.update({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.config.colors.error)
                            .setAuthor({ name: `${locale('_global.error')} — ${message.author.displayName}`, iconURL: message.author.displayAvatarURL() })
                            .setDescription(locale('commands.botlist.status.channel_not_found_error'))
                            .setFooter({ text: locale('_global.error_occured'), iconURL: client.config.icons.success })
                            .setTimestamp()
                    ],
                    components: []
                });

                return collector.stop();
            };

            const send_msg = await channel.send({
                embeds: [embed],
                components: v === 2 ? [
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(v === 2 ? `botlist.add_bot_button-${message.guild.id}-${Math.random().toString(36).substring(2)}` : `botlist.add_bot_pin-${message.guild.id}-${Math.random().toString(36).substring(2)}`)
                                .setLabel(locale('commands.botlist.status.add_bot_button'))
                                .setStyle(ButtonStyle.Secondary)
                        )
                ] : []
            });

            await Guild.updateOne({ guildId: message.guild.id }, { $set: { 'botlist.addType': v, 'botlist.status': 1, 'botlist.message': send_msg.id } }, { upsert: true });
            await i.update({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.colors.success)
                        .setAuthor({ name: `${locale('_global.success')} — ${message.author.displayName}`, iconURL: message.author.displayAvatarURL() })
                        .setDescription(locale('commands.botlist.status.success_enable'))
                        .addFields((locale as any)('commands.botlist.status.success_enable_fields').map((x: any) => ({
                            name: x.name,
                            value: x.value.replaceAll('{type}', v === 1 ? locale('commands.botlist.type.options_1_label') : v === 2 ? locale('commands.botlist.type.options_2_label') : locale('commands.botlist.type.options_3_label'))
                        })))
                        .setFooter({ text: locale('_global.success_occured'), iconURL: client.config.icons.success })
                        .setTimestamp()
                ],
                components: []
            });

            collector.stop();
        });
    } else {
        await Guild.updateOne({ guildId: message.guild.id }, {
            $set: {
                'botlist.status': 0,
                'botlist.addType': 0,
                'botlist.pin': null,
                'botlist.message': null
            }
        }, { upsert: true });
        return message.success(locale('commands.botlist.status.success_disable'));
    };
};