import { Interaction, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonInteraction, CacheType, ButtonStyle, ChannelType } from 'discord.js';
import { InferSchemaType, set } from 'mongoose';
import { Events } from '../../structures';
import { User, Guild, Requests } from '../../models';
import { Localizer, Tasks } from '../../managers';
import { InteractionUtils, ModalUtils } from '../../utils';

export const Event: Events = {
    name: 'interactionCreate',
    on: 'on',
    run: async (client, interaction: Interaction) => {
        try {
            if (!interaction.isButton() || !interaction.customId.match(/partner\.(approve|deny|blacklist|info|view_text)/)) return;

            const transaction = interaction.customId.split('.')[1];
            if (transaction !== 'deny') await interaction.deferReply({ ephemeral: true }).catch(() => { });

            const user_db = await User.findOne({ user: interaction.user.id }, { _id: 0, banned: 1, amount: 1, locale: 1 });
            const guilds = client.collectionGuilds.get('database_guild');
            const db = guilds.find((g: InferSchemaType<typeof Guild['schema']>) => g.guildId === interaction.guild.id) as InferSchemaType<typeof Guild['schema']>;
            const locale = Localizer(client, user_db);
            const guild_locale = client.locales.get(db?.locale ?? client.config.main.default_locale);
            const i = await InteractionUtils(client, interaction, transaction) as ButtonInteraction<CacheType>; // ?? bug olabilir

            if (user_db?.banned?.ban) return i.error(locale('errors.user_banned', { reason: user_db.banned.reason }));
            if (!db || !db?.partner?.text || !db?.partner?.staff || !db?.partner?.channel || db?.partner?.status === 0) return i.error(locale('events.partner.settings_error'));
            if (Array.isArray(i.member.roles)) return i.error(locale('events.partner.role_error'));

            const is_admin = i.memberPermissions.has(PermissionFlagsBits.Administrator);
            const is_staff = i.member.roles.cache.has(db.partner.staff) || db?.partner?.access?.includes(interaction.user.id);
            if (!is_admin && !is_staff) return i.error(locale('events.partner.permission_denied', { role: `${db.partner.staff}` }));

            /*const reqs = client.collectionGuilds.get('database_requests');
            const offer = reqs.find((r: InferSchemaType<typeof Requests['schema']>) => r.message === interaction.message.id) as InferSchemaType<typeof Requests['schema']>;*/
            const offer = await Requests.findOne({ message: interaction.message.id });
            if (!offer) return i.error(locale('events.partner.request_not_found'));

            const target_db = guilds.find((g: InferSchemaType<typeof Guild['schema']>) => g.guildId === offer.guild) as InferSchemaType<typeof Guild['schema']>;
            if (!target_db || !target_db?.partner?.text || !target_db?.partner?.staff || !target_db?.partner?.channel || target_db?.partner?.status === 0) {
                if (i.message.deletable) await i.message.delete().catch(() => { });

                await Requests.deleteOne({ message: i.message.id });
                return i.error(locale('events.partner.settings_error_target'));
            };

            const target_guild_locale = client.locales.get(target_db?.locale ?? client.config.main.default_locale);
            if (target_db.partner?.blacklists?.guilds?.includes(i.guild.id) && target_db.partner?.blacklists?.categories?.includes(db.partner.category)) return i.error(locale('events.partner.blacklist_error'));
            if (db.partner?.blacklists?.guilds?.includes(offer.guild)) return i.error(locale('events.partner.blacklist_error_this'));

            const target_guild = await client.shardManager.getGuild(offer.guild);
            const [this_channel, target_channel] = await Promise.all([
                client.shardManager.shardEval(i.guild.shardId, 'GET_CHANNEL', { guild: i.guild.id, channel: db.partner.channel }),
                client.shardManager.shardEval(target_guild.shardId, 'GET_CHANNEL', { guild: String(target_guild.id), channel: String(target_db.partner.channel) })
            ]);

            if (!target_guild || !target_channel?.[0] || target_channel?.[0]?.type !== ChannelType.GuildText) return i.error(locale('events.partner.target_settings_error'));
            if (!this_channel?.[0] || this_channel?.[0]?.type !== ChannelType.GuildText) return i.error(locale('events.partner.channel_settings_error'));

            switch (i.customId) {
                case 'partner.approve': {
                    await i.message.edit({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('White')
                                .setAuthor({
                                    name: locale('events.partner.loading_author'),
                                    iconURL: i.user.displayAvatarURL()
                                })
                                .setDescription(locale('events.partner.loading_description'))
                                .setFooter({
                                    text: locale('events.partner.loading_footer', { count: String(db?.partner?.total + 1) }),
                                    iconURL: client.config.icons.info
                                })
                                .setTimestamp()
                        ],
                        components: []
                    });

                    if (!(await client.shardManager.shardEval(i.guild.shardId, 'CLIENT_CHECK_PERM', { channel: db.partner.channel, perm: 'MentionEveryone' }))) return i.sendError(locale('events.partner.mention_error'));
                    // console.log(target_guild.data.shardId, await client.shardManager.shardEval(target_guild.data.shardId, 'CLIENT_CHECK_PERM', { channel: target_db.partner.channel, perm: 'MentionEveryone' }))
                    if (!(await client.shardManager.shardEval(target_guild.shardId, 'CLIENT_CHECK_PERM', { channel: target_db.partner.channel, perm: 'MentionEveryone' }))) {
                        await client.shardManager.sendMessage(i.guild.id, db.partner.channel, {
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('Red')
                                    .setAuthor({
                                        name: locale('events.partner.target_mention_error_author'),
                                        iconURL: `https://cdn.discordapp.com/icons/${target_guild.id}/${target_guild.icon}`
                                    })
                                    .setDescription(locale('events.partner.target_mention_error'))
                            ]
                        });

                        return i.error(locale('events.partner.target_mention_error_2'));
                    };

                    const perm_check = await client.shardManager.sendMessage(i.guild.id, db.partner.channel, { content: '> *Permission checker.*' });
                    if (!perm_check) {
                        return i.sendError(locale('unknown err'));
                    } else {
                        await client.shardManager.deleteMessage(i.guild.id, db.partner.channel, perm_check.id, i.guild.shardId);
                    };

                    const target_perm_check = await client.shardManager.sendMessage(target_guild.id, target_db.partner.channel, { content: '> *Permission checker.*' });
                    if (!target_perm_check) {
                        await client.shardManager.sendMessage(i.guild.id, db.partner.channel, {
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('Red')
                                    .setAuthor({
                                        name: locale('events.partner.target_no_channel_permission_error_author'),
                                        iconURL: `https://cdn.discordapp.com/icons/${target_guild.id}/${target_guild.icon}`
                                    })
                                    .setDescription(locale('events.partner.target_no_channel_permission_error_desc'))
                            ]
                        });

                        return i.error(locale('unknown err'));
                    } else {
                        await client.shardManager.deleteMessage(target_guild.id, target_db.partner.channel, target_perm_check.id, target_guild.shardId);
                    };

                    const [this_presence, target_presence] = await Promise.all([
                        client.shardManager.shardEval(i.guild.shardId, 'GET_PRESENCES', { guild: i.guild.id }),
                        client.shardManager.shardEval(target_guild.shardId, 'GET_PRESENCES', { guild: String(target_guild.id) })
                    ]);

                    const [this_text, target_text] = await Promise.all([
                        client.utils.PartnerText(client, db, i.guild, target_guild, this_presence),
                        client.utils.PartnerText(client, target_db, target_guild, i.guild, target_presence)
                    ]);

                    const check_this_everyone = db.partner.text?.includes('@' + 'everyone');
                    const check_target_everyone = target_db.partner.text?.includes('@' + 'everyone');

                    if (this_text.embed) {
                        /*await client.shardManager.shardEval(target_guild.shardId, 'SEND_MESSAGE', {
                            guild: target_guild.id,
                            channel: target_db.partner.channel,
                            payload: {
                                content: '@everyone & @here',
                                embeds: [this_text.embed],
                                components: (!this_text.button ? [] : [
                                    new ActionRowBuilder<ButtonBuilder>()
                                        .addComponents(
                                            this_text.button
                                        )
                                ])
                            }
                        });*/

                        await client.shardManager.sendMessage(target_guild.id, target_db.partner.channel, {
                            content: '@everyone & @here',
                            embeds: [this_text.embed],
                            components: (!this_text.button ? [] : [
                                new ActionRowBuilder<ButtonBuilder>()
                                    .addComponents(
                                        this_text.button
                                    )
                            ])
                        });
                    } else {
                        await client.shardManager.sendMessage(target_guild.id, target_db.partner.channel, {
                            content: [
                                (this_text.text),
                                '',
                                (!check_this_everyone ? '@everyone & @here' : '')
                            ].join('\n'),
                            components: (!this_text.button ? [] : [
                                new ActionRowBuilder<ButtonBuilder>()
                                    .addComponents(
                                        this_text.button
                                    )
                            ])
                        });
                    };

                    if (target_text.embed) {
                        await client.shardManager.sendMessage(i.guild.id, db.partner.channel, {
                            content: '@everyone & @here',
                            embeds: [target_text.embed],
                            components: (!target_text.button ? [] : [
                                new ActionRowBuilder<ButtonBuilder>()
                                    .addComponents(
                                        target_text.button
                                    )
                            ])
                        });
                    } else {
                        await client.shardManager.sendMessage(i.guild.id, db.partner.channel, {
                            content: [
                                (target_text.text),
                                '',
                                (!check_target_everyone ? '@everyone & @here' : '')
                            ].join('\n'),
                            components: (!target_text.button ? [] : [
                                new ActionRowBuilder<ButtonBuilder>()
                                    .addComponents(
                                        target_text.button
                                    )
                            ])
                        });
                    };

                    if (target_db?.partner?.users?.find((u: any) => u.user === offer.author)) {
                        await Guild.updateOne(
                            { guildId: target_guild.id, 'partner.users.user': offer.author },
                            {
                                $set: {
                                    'partner.users.$.data': {
                                        [`${String(new Date().getDate()).padStart(2, '0')}.${String(new Date().getMonth() + 1).padStart(2, '0')}.${new Date().getFullYear()}`]: (target_db.partner.users.find((u: any) => u.user === offer.author)?.data[String(new Date().getDate()).padStart(2, '0') + '.' + String(new Date().getMonth() + 1).padStart(2, '0') + '.' + new Date().getFullYear()] ?? 0) + 1 ?? 1
                                    }
                                },
                                $inc: {
                                    'partner.users.$.total': 1
                                }
                            },
                            { upsert: true }
                        );
                    } else {
                        await Guild.updateOne(
                            { guildId: target_guild.id },
                            {
                                $push: {
                                    'partner.users': {
                                        user: offer.author,
                                        total: 1,
                                        data: {
                                            [`${String(new Date().getDate()).padStart(2, '0')}.${String(new Date().getMonth() + 1).padStart(2, '0')}.${new Date().getFullYear()}`]: 1
                                        }
                                    }
                                },
                            },
                            { upsert: true }
                        );
                    };

                    if ((db?.partner?.users?.find((u: any) => u.user === i.user.id)?.data[`${String(new Date().getDate()).padStart(2, '0')}.${String(new Date().getMonth() + 1).padStart(2, '0')}.${new Date().getFullYear()}`] ?? 0) + 1 || 1) {
                        await Guild.updateOne(
                            { guildId: i.guild.id, 'partner.users.user': i.user.id },
                            {
                                $set: {
                                    'partner.users.$.data': {
                                        [`${String(new Date().getDate()).padStart(2, '0')}.${String(new Date().getMonth() + 1).padStart(2, '0')}.${new Date().getFullYear()}`]: (db?.partner?.users?.find((u: any) => u.user === i.user.id)?.data[String(new Date().getDate()).padStart(2, '0') + '.' + String(new Date().getMonth() + 1).padStart(2, '0') + '.' + new Date().getFullYear()] ?? 0) + 1 ?? 1
                                    }
                                },
                                $inc: {
                                    'partner.users.$.total': 1
                                }
                            },
                            { upsert: true }
                        );
                    } else {
                        await Guild.updateOne(
                            { guildId: i.guild.id },
                            {
                                $push: {
                                    'partner.users': {
                                        user: i.user.id,
                                        total: 1,
                                        data: {
                                            [`${String(new Date().getDate()).padStart(2, '0')}.${String(new Date().getMonth() + 1).padStart(2, '0')}.${new Date().getFullYear()}`]: 1
                                        }
                                    }
                                },
                            },
                            { upsert: true }
                        );
                    };
                    await Promise.all([
                        /*Guild.updateOne({ guildId: i.guild.id }, {
                            $inc: {
                                'partner.total': 1,
                                'partner.point': 1,
                                'case.total': client.config.prices.partnership.guild
                            },
                            $push: {
                                'case.history': {
                                    executor: i.user.id,
                                    coin: client.config.prices.partnership.guild,
                                    reason: 'reason_partner'
                                }
                            }
                        }, { upsert: true }),
                        Guild.updateOne({ guildId: target_guild.data.id }, {
                            $inc: {
                                'partner.total': 1,
                                'partner.point': 2,
                                'case.total': client.config.prices.partnership.target
                            },
                            $push: {
                                'case.history': {
                                    executor: i.user.id,
                                    coin: client.config.prices.partnership.target,
                                    reason: 'reason_partner'
                                }
                            }
                        }, { upsert: true }),*/
                        Guild.updateOne({ guildId: i.guild.id }, {
                            $inc: {
                                'partner.total': 1,
                                'partner.point': 1,
                            },
                        }, { upsert: true }),
                        Guild.updateOne({ guildId: target_guild.id }, {
                            $inc: {
                                'partner.total': 1,
                                'partner.point': 2,
                            },
                        }, { upsert: true }),
                        await User.updateOne({ user: i.user.id }, {
                            $inc: {
                                amount: client.config.prices.partnership.user
                            },
                            $push: {
                                history: {
                                    staff: 'System',
                                    reason: 'partner',
                                    amount: client.config.prices.partnership.user,
                                    date: Date.now()
                                }
                            }
                        }, { upsert: true }),
                        await User.updateOne({ user: offer.author }, {
                            $inc: {
                                amount: client.config.prices.partnership.user
                            },
                            $push: {
                                history: {
                                    staff: 'System',
                                    reason: 'partner',
                                    amount: client.config.prices.partnership.user,
                                    date: Date.now()
                                }
                            }
                        }, { upsert: true }),
                        Requests.deleteOne({ guild: offer.guild, target: offer.target })
                    ]);

                    if (i.message.deletable) i.message.delete().catch(() => { });

                    await client.utils.Partner.SEND_LOG(client, guild_locale.__, i, {
                        this: {
                            guild: i.guild,
                            guild_db: db
                        },
                        target: {
                            guild: target_guild,
                            guild_db: target_db
                        },
                        request: offer
                    }, true);

                    await client.utils.Partner.SEND_LOG(client, target_guild_locale.__, i, {
                        this: {
                            guild: target_guild,
                            guild_db: target_db,
                        },
                        target: {
                            guild: i.guild,
                            guild_db: db
                        },
                        request: offer
                    }, true);

                    await i.success(locale('events.partner.success'));

                    const task = new Tasks();
                    await task.update(interaction.user.id, 'partner', 1).then(d => {
                        let locale = client.locales.get(user_db?.locale ?? client.config.main.default_locale);
                        let icon: string;
                        if (d.difficulty === 1) icon = client.config.icons.task_1;
                        if (d.difficulty === 2) icon = client.config.icons.task_2;
                        if (d.difficulty === 3) icon = client.config.icons.task_3;

                        if (d.finished) {
                            interaction.channel.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor('Blue')
                                        .setAuthor({ name: `${locale.__._global.task} — ${interaction.user.globalName}`, iconURL: interaction.user.displayAvatarURL() })
                                        .setDescription(locale.__.commands.tasks.messages.partner.replace('{amount}', String(d.prize)).replace('{user}', interaction.user.id))
                                        .setThumbnail(icon)
                                        .setFooter({ text: locale.__._global.task_occured, iconURL: client.config.icons.info })
                                        .setTimestamp()
                                ]
                            })
                        };
                    });
                    break;
                };
                case 'partner.deny': {
                    const create_modal = new client.managers.ModalManager(client, i);
                    const modal = await create_modal.build(`partner.deny.reason`, {
                        modal: new ModalBuilder()
                            .setTitle(locale('events.partner.deny_modal_title'))
                            .addComponents(
                                new ActionRowBuilder<TextInputBuilder>()
                                    .addComponents(
                                        new TextInputBuilder()
                                            .setCustomId('partner.deny.reason')
                                            .setPlaceholder(locale('events.partner.deny_modal_placeholder'))
                                            .setLabel(locale('events.partner.deny_modal_label'))
                                            .setStyle(TextInputStyle.Paragraph)
                                            .setRequired(true)
                                    )
                            )
                    });

                    const reason = modal.fields.getTextInputValue('partner.deny.reason');
                    const detect = await client.nlp.detect(reason);
                    if (detect.detected === true) {
                        await modal.deferReply({ ephemeral: true });

                        const modal_interaction = await ModalUtils(client, modal);
                        await client.shardManager.sendMessage(client.config.main.staffs.support_server_id, client.config.main.staffs.badwords_log, {
                            content: `**${i.guild.name} (${i.guild.id})** sunucusunda, **${i.user.displayName} (${i.user.username}, ${i.user.id})** tarafından gönderilen bir red sebebinde kötü kelime algıandı.\n\nTür: **${detect.type}**\nReddetme sebebi: **${reason}**`,
                            components: [
                                new ActionRowBuilder<ButtonBuilder>()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setCustomId(`badwords.warn-${Math.floor(Math.random() * 2000)}-${i.guild.id}-${i.user.id}`)
                                            .setLabel('Ekle')
                                            .setStyle(ButtonStyle.Secondary)
                                    )
                            ]
                        });

                        return await modal_interaction.error(locale('commands.partner.badwords_detected'));
                    };

                    await modal.deferUpdate();
                    await client.utils.Partner.SEND_LOG(client, guild_locale.__, i, {
                        this: {
                            guild: i.guild,
                            guild_db: db
                        },
                        target: {
                            guild: target_guild,
                            guild_db: target_db
                        },
                        request: offer
                    }, false, reason);

                    await client.utils.Partner.SEND_LOG(client, target_guild_locale.__, i, {
                        this: {
                            guild: target_guild,
                            guild_db: target_db,
                        },
                        target: {
                            guild: i.guild,
                            guild_db: db
                        },
                        request: offer
                    }, false, reason);

                    await Requests.deleteOne({ guild: offer.guild, target: offer.target });

                    if (i.message.deletable) i.message.delete().catch(() => { });

                    const task = new Tasks();
                    await task.update(interaction.user.id, 'partner', 1).then(d => {
                        let locale = client.locales.get(user_db?.locale ?? client.config.main.default_locale);
                        let icon: string;
                        if (d.difficulty === 1) icon = client.config.icons.task_1;
                        if (d.difficulty === 2) icon = client.config.icons.task_2;
                        if (d.difficulty === 3) icon = client.config.icons.task_3;

                        if (d.finished) {
                            interaction.channel.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor('Blue')
                                        .setAuthor({ name: `${locale.__._global.task} — ${interaction.user.globalName}`, iconURL: interaction.user.displayAvatarURL() })
                                        .setDescription(locale.__.commands.tasks.messages.partner.replace('{amount}', String(d.prize)).replace('{user}', interaction.user.id))
                                        .setThumbnail(icon)
                                        .setFooter({ text: locale.__._global.task_occured, iconURL: client.config.icons.info })
                                        .setTimestamp()
                                ]
                            })
                        };
                    });
                    break;
                };
                case 'partner.blacklist': {
                    const id = offer.guild;

                    if (db?.partner?.blacklists?.guilds?.includes(id)) return i.error(locale('events.partner.already_blacklist'));
                    await Guild.updateOne({ guildId: i.guild.id }, {
                        $push: {
                            'partner.blacklists.guilds': id
                        }
                    }, { upsert: true });

                    await i.success(locale('events.partner.blacklist_success', { guild: target_guild.name }));

                    await Requests.deleteOne({ guild: offer.guild, target: offer.target });
                    await i.message.delete().catch(() => { });
                    break;
                };
                case 'partner.view_text': {
                    await i.followUp({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.config.colors.blank)
                                .setDescription(target_db.partner.text)
                                .setFooter({
                                    text: locale('events.partner.view_text_footer'),
                                    iconURL: client.config.icons.info
                                })
                        ]
                    });
                };
            };
        } catch (err) {
            console.error(err);
        };
    }
};