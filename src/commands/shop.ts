import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, ButtonStyle, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { Commands } from '../structures';
import { User, Guild } from '../models';
import { ModalUtils } from '../utils';
import { Tasks } from '../managers';
import moment from 'moment';
import 'moment-duration-format';

export const Command: Commands = {
    name: 'market',
    description: 'satın alıyon',
    aliases: ['shop'],
    category: 'user',
    cooldown: 5000,
    run: async (client, message, args, locale) => {
        let user = await User.findOne({ user: message.author.id }, { amount: 1, inventory: 1 });
        let guild = await Guild.findOne({ guildId: message.guild.id }, { partner: 1, subscriptions: 1, prefix: 1 });

        const check_perm = message.member.permissions.has('ManageGuild');
        const products = [
            {
                type: 'subscribe',
                id: 'partner_random',
                name: locale('cases.items.partner_random'),
                description: locale('cases.items.shop_partner_random_desc'),
                price: client.config.prices.partner_random,
                content: locale('cases.items.shop_partner_random_content'),
                time: null,
                isAdmin: true,
                buyable: (): boolean => {
                    if (check_perm === false) return false;

                    return user?.amount >= client.config.prices.partner_random ? true : false;
                },
                sellable: (): boolean => {
                    return false;
                },
                buy: (msg: Message, amount: number): Promise<boolean> => new Promise(async r => {
                    const user = await User.findOne({ user: message.author.id });
                    if (!user) return r(false);

                    const total = amount * 10;
                    const price = amount * client.config.prices.partner_random;

                    await Promise.all([
                        await User.updateOne({ user: message.author.id }, {
                            $inc: {
                                amount: -price
                            },
                            $push: {
                                history: {
                                    reason: 'buy',
                                    amount: -price,
                                    staff: 'System',
                                    date: Date.now()
                                }
                            }
                        }),
                        await Guild.updateOne({ guildId: message.guild.id }, {
                            $inc: {
                                'subscriptions.partner_random': total
                            }
                        }, { upsert: true })
                    ]);

                    return r(true);
                })
            },
            {
                type: 'subscribe',
                id: 'partner_url',
                name: locale('cases.items.partner_url'),
                description: locale('cases.items.shop_partner_url_desc'),
                content: locale('cases.items.shop_partner_url_content'),
                time: 1000 * 60 * 60 * 24 * 7,
                isAdmin: true,
                remaining: (): string => {
                    const remain = guild.partner.specialUrlMs - (Date.now() - guild.partner.specialUrlDate);
                    if (remain < 1) return locale('commands.shop.end_soon')

                    return (moment.duration(remain) as any).format(locale('format'));
                },
                price: client.config.prices.partner_url,
                buyable: (): boolean => {
                    if (check_perm === false) return false;
                    if (guild?.partner?.specialUrl) return false;
                    return user?.amount >= client.config.prices.partner_url ? true : false;
                },
                sellable: (): boolean => {
                    if (check_perm === false) return false;
                    if (!guild?.partner?.specialUrl) return false;
                    return true;
                },
                buy: (msg: Message, amount: number, value: string): Promise<boolean> => new Promise(async r => {
                    const user = await User.findOne({ user: message.author.id });
                    if (!user) return r(false);

                    const price = client.config.prices.partner_url;
                    await Promise.all([
                        await User.updateOne({ user: message.author.id }, {
                            $inc: {
                                amount: -price
                            },
                            $push: {
                                history: {
                                    reason: 'buy',
                                    amount: -price,
                                    staff: 'System',
                                    date: Date.now()
                                }
                            }
                        }),
                        await Guild.updateOne({ guildId: message.guild.id }, {
                            $set: {
                                'partner.specialUrl': value,
                                'partner.specialUrlMs': 1000 * 60 * 60 * 24 * 7,
                                'partner.specialUrlDate': Date.now()
                            }
                        }, { upsert: true })
                    ]);

                    return r(true);
                })
            },
            {
                type: 'subscribe',
                id: 'partner_prefix',
                name: locale('cases.items.guild_prefix'),
                description: locale('cases.items.shop_guild_prefix_desc'),
                content: locale('cases.items.shop_guild_prefix_content'),
                time: null,
                isAdmin: true,
                price: client.config.prices.guild_prefix,
                buyable: (): boolean => {
                    if (check_perm === false) return false;
                    return user?.amount >= client.config.prices.guild_prefix ? true : false;
                },
                sellable: (): boolean => {
                    return false;
                },
                buy: (msg: Message, amount: number, value: string): Promise<boolean> => new Promise(async r => {
                    const user = await User.findOne({ user: message.author.id });
                    if (!user) return r(false);

                    const price = client.config.prices.guild_prefix;
                    await Promise.all([
                        await User.updateOne({ user: message.author.id }, {
                            $inc: {
                                amount: -price
                            },
                            $push: {
                                history: {
                                    reason: 'buy',
                                    amount: -price,
                                    staff: 'System',
                                    date: Date.now()
                                }
                            }
                        }),
                        await Guild.updateOne({ guildId: message.guild.id }, {
                            $set: {
                                'prefix': value
                            }
                        }, { upsert: true })
                    ]);

                    return r(true);
                })
            },
        ].concat(...client.config.cases.map(x => ({
            type: 'case',
            id: x.id,
            name: locale(`cases.${x.id}`),
            price: (client.config.prices.case as any)[x.id],
            description: locale(`cases.${x.id}_desc`),
            content: locale(`cases.${x.id}_content`),
            time: null,
            isAdmin: false,
            buyable: (): boolean => {
                return true;
            },
            sellable: (): boolean => {
                return user?.inventory?.find(i => i.id === x.id)?.total ?? 0 > 0 ? true : false;
            },
            buy: (msg: Message, amount: number): Promise<boolean> => new Promise(async r => {
                const user = await User.findOne({ user: message.author.id });
                if (!user) return r(false);

                const price = (client.config.prices.case as any)[x.id] * amount;
                if ((user?.inventory ?? [])?.find(i => i.id === x.id)) {
                    await Promise.all([
                        await User.updateOne({ user: message.author.id }, {
                            $inc: {
                                amount: -price
                            },
                            $push: {
                                history: {
                                    reason: 'buy',
                                    amount: -price,
                                    staff: 'System',
                                    date: Date.now()
                                }
                            },
                        }, { upsert: true }),
                        await User.updateOne({ user: message.author.id, 'inventory.id': x.id }, {
                            $inc: {
                                'inventory.$.total': amount
                            }
                        }, { upsert: true })
                    ])
                } else {
                    await Promise.all([
                        await User.updateOne({ user: message.author.id }, {
                            $inc: {
                                amount: -price
                            },
                            $push: {
                                history: {
                                    reason: 'buy',
                                    amount: -price,
                                    staff: 'System',
                                    date: Date.now()
                                }
                            },
                        }, { upsert: true }),
                        await User.updateOne({ user: message.author.id }, {
                            $push: {
                                inventory: {
                                    type: 'case',
                                    id: x.id,
                                    total: amount
                                }
                            }
                        }, { upsert: true })
                    ]);
                };

                return r(true);
            })
        })));

        const per_page = 3;
        const max_page = Math.ceil(products.length / per_page);

        let page = 1;
        let sell_mode: boolean = false;

        const get_embed = (shop_err?: boolean) => new EmbedBuilder()
            .setColor(client.config.colors.main)
            .setAuthor({ name: `${message.author.displayName} ${locale('commands.shop.author')}`, iconURL: message.author.displayAvatarURL() })
            .setFooter(!shop_err ? { text: locale('commands.shop.footer'), iconURL: client.config.icons.shop } : { text: locale('commands.shop.footer_error'), iconURL: client.config.icons.warning })
            .setTimestamp()
            .setDescription(check_perm ? locale('commands.shop.desc_1') : locale('commands.shop.desc_2'))
            .addFields(products.slice((page - 1) * per_page, page * per_page).map(x => ({
                name: `${x.name}`,
                value: (locale as any)('commands.shop.value').join('\n')
                    .replace('{description}', x.type === 'case' ? locale('commands.shop.case_desc') : x.description)
                    .replace('{price}', String(x.price))
                    .replace('{buyable}', !x.buyable() ? ((user?.amount ?? 0) < x.price) ? locale('commands.shop.buyable_not_enough_money') : locale('commands.shop.buyable_active_sub') : locale('commands.shop.buyable'))
                    .replace('{type}', locale(`commands.shop.types.${x.type}`))
                    .replace('{content}', x.type === 'case' ? locale('commands.shop.content_case') : x.content)
                    .replace('{timeOrTotal}', x.type !== 'case' ? x.id === 'partner_url' ? guild?.partner?.specialUrl ? locale('commands.shop.remaining') : locale('commands.shop.time') : locale('commands.shop.time') : locale('commands.shop.total'))
                    .replace('{duration}', x.type !== 'case' ? x.id === 'partner_url' ? guild?.partner?.specialUrl ? x.remaining() : x.time ? (moment.duration(x.time) as any).format(x.time > (1000 * 60 * 60 * 24) ? 'D [gün]' : 'H [saat]') : locale('commands.shop.time_not') : locale('commands.shop.time_not') : String((user?.inventory ?? [])?.find(i => i.id === x.id)?.total ?? 0)),
                inline: true
            })));

        const get_components = (d?: boolean) => [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('shop.prev')
                        .setEmoji(client.config.emojis.previous)
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(d ? true : (page === 1)),
                    new ButtonBuilder()
                        .setCustomId('shop.next')
                        .setEmoji(client.config.emojis.next)
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(d ? true : (page === max_page)),
                    new ButtonBuilder()
                        .setCustomId('shop.sell_mode')
                        .setEmoji(client.config.emojis.sell)
                        .setStyle(sell_mode ? ButtonStyle.Success : ButtonStyle.Danger),
                    /*new ButtonBuilder()
                        .setCustomId('shop.subscriptions')
                        .setEmoji(client.config.emojis.subscriptions)
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(sell_mode ? true : !check_perm)*/
                ),
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(...products.slice((page - 1) * per_page, page * per_page).map((p, i) => (
                    new ButtonBuilder()
                        .setStyle(sell_mode ? ButtonStyle.Danger : ButtonStyle.Primary)
                        .setEmoji('1010917379066306660')
                        .setLabel(!sell_mode ? locale('commands.shop.buy', { item: p.name }) : locale('commands.shop.sell', { item: p.name }))
                        .setCustomId(sell_mode ? `shop.sell-${i}` : `shop.buy-${i}`)
                        .setDisabled(sell_mode ? !p.sellable() : d ? true : !p.buyable())
                )))
        ];

        const msg = await message.channel.send({
            embeds: [get_embed()],
            components: get_components()
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

            if (i.customId === 'shop.prev') {
                await i.deferUpdate();
                page = Math.max(1, page - 1);
                await msg.edit({
                    embeds: [get_embed()],
                    components: get_components()
                }).catch(() => { });
            } else if (i.customId === 'shop.next') {
                await i.deferUpdate();
                page = Math.min(max_page, page + 1);
                await msg.edit({
                    embeds: [get_embed()],
                    components: get_components()
                }).catch(() => { });
            } else if (i.customId.startsWith('shop.buy-')) {
                const product = products.slice((page - 1) * per_page, page * per_page)[Number(i.customId.split('-')[1])];
                if (!product) {
                    await i.reply({ content: 'qwe', ephemeral: true });
                    return;
                };

                if (product.id === 'partner_url') {
                    const create_modal = new client.managers.ModalManager(client, i);
                    const modal = await create_modal.build(`shop.buy-${Math.floor(Math.random() * 1000)}`, {
                        modal: new ModalBuilder()
                            .setTitle(locale('commands.shop.url_modals_title'))
                            .addComponents(
                                new ActionRowBuilder<TextInputBuilder>()
                                    .addComponents(
                                        new TextInputBuilder()
                                            .setCustomId('shop.buy_amount_interaction.input')
                                            .setLabel(locale('commands.shop.label'))
                                            .setPlaceholder('ex: partnerbot')
                                            .setStyle(TextInputStyle.Short)
                                            .setMinLength(client.config.limits.special_url_min)
                                            .setMaxLength(client.config.limits.special_url_max)
                                            .setRequired(true)
                                    )
                            )
                    });

                    const value = modal.fields.getTextInputValue('shop.buy_amount_interaction.input');
                    const modal_interaction = await ModalUtils(client, modal, true);

                    user = await User.findOne({ user: message.author.id });
                    const total = product.price;

                    if (!user || (user?.amount ?? 0) < total) {
                        await modal_interaction.error(locale('commands.shop.errors.not_enough_money', { amount: String(total) }));

                        return;
                    };

                    const check = await Guild.findOne({
                        $or: [
                            { 'partner.specialUrl': value },
                            { 'partner.url': value }
                        ]
                    });

                    if (check) {
                        await modal_interaction.error(locale('commands.shop.errors.special_url_exists', { url: value }));
                        return;
                    };

                    if (value.replace(/[a-zA-Z0-9]/g, '').length !== 0) {
                        await modal_interaction.error(locale('commands.shop.errors.special_url_invalid'));
                        return;
                    };

                    const res = await product.buy(msg, 1, value);
                    if (res === true) {
                        await modal_interaction.success(locale('commands.shop.success', { coin: String(total), amount: '1', item: product.name })).catch(() => { });

                        const task = new Tasks();
                        await task.update(message.author.id, 'buy_item', 1).then(d => {
                            if (d.finished) {
                                message.sendTask('buy_item', d.difficulty, d.prize);
                            };
                        });

                        guild = await Guild.findOne({ guildId: message.guild.id }, { partner: 1, subscriptions: 1 });
                        user = await User.findOne({ user: message.author.id }, { amount: 1, inventory: 1 });
                        await msg.edit({
                            embeds: [get_embed()],
                            components: get_components()
                        }).catch(() => { });
                    };


                    return;
                } else if (product.id === 'partner_prefix') {
                    const create_modal = new client.managers.ModalManager(client, i);
                    const modal = await create_modal.build(`shop.buy-${Math.floor(Math.random() * 1000)}`, {
                        modal: new ModalBuilder()
                            .setTitle(locale('commands.shop.prefix_modals_title'))
                            .addComponents(
                                new ActionRowBuilder<TextInputBuilder>()
                                    .addComponents(
                                        new TextInputBuilder()
                                            .setCustomId('shop.buy_amount_interaction.input')
                                            .setLabel(locale('commands.shop.label'))
                                            .setPlaceholder('default: !')
                                            .setStyle(TextInputStyle.Short)
                                            .setMaxLength(client.config.limits.guild_prefix_max)
                                            .setRequired(true)
                                    )
                            )
                    });

                    const value = modal.fields.getTextInputValue('shop.buy_amount_interaction.input');
                    const modal_interaction = await ModalUtils(client, modal, true);

                    const res = await product.buy(msg, 1, value);
                    if (res === true) {
                        const total = product.price;
                        await modal_interaction.success(locale('commands.shop.success', { coin: String(total), amount: '1', item: product.name })).catch(() => { });

                        const task = new Tasks();
                        await task.update(message.author.id, 'buy_item', 1).then(d => {
                            if (d.finished) {
                                message.sendTask('buy_item', d.difficulty, d.prize);
                            };
                        });

                        guild = await Guild.findOne({ guildId: message.guild.id }, { partner: 1, subscriptions: 1, prefix: 1 });
                        user = await User.findOne({ user: message.author.id }, { amount: 1, inventory: 1 });
                        await msg.edit({
                            embeds: [get_embed()],
                            components: get_components()
                        }).catch(() => { });
                    };
                };

                const create_modal = new client.managers.ModalManager(client, i);
                const modal = await create_modal.build(`shop.buy-${Math.floor(Math.random() * 1000)}`, {
                    modal: new ModalBuilder()
                        .setTitle(locale('commands.shop.modals_title'))
                        .addComponents(
                            new ActionRowBuilder<TextInputBuilder>()
                                .addComponents(
                                    new TextInputBuilder()
                                        .setCustomId('shop.buy_amount_interaction.input')
                                        .setLabel(locale('commands.shop.label'))
                                        .setPlaceholder('12, 100')
                                        .setStyle(TextInputStyle.Short)
                                        .setMinLength(client.config.limits.shop_buy_amount_min)
                                        .setMaxLength(client.config.limits.shop_buy_amount_max)
                                        .setRequired(true)
                                )
                        )
                });

                const amount = modal.fields.getTextInputValue('shop.buy_amount_interaction.input');
                const modal_interaction = await ModalUtils(client, modal, true);

                if ((amount as any) > client.config.limits.shop_buy_amount_max) {
                    await modal_interaction.error(locale('commands.shop.errors.amount_max', { max: String(client.config.limits.shop_buy_amount_max) }));
                    return;
                };

                user = await User.findOne({ user: message.author.id });
                const total = product.price * (amount as any);

                if (!user || (user?.amount ?? 0) < total) {
                    await modal_interaction.error(locale('commands.shop.errors.not_enough_money', { amount: String(total) }));

                    return;
                };

                const res = await product.buy(msg, Number(amount), null);
                if (res === true) {
                    await modal_interaction.success(locale('commands.shop.success', { coin: String(total), amount: String(amount), item: product.name })).catch(() => { });

                    const task = new Tasks();
                    await task.update(message.author.id, 'buy_item', 1).then(d => {
                        if (d.finished) {
                            message.sendTask('buy_item', d.difficulty, d.prize);
                        };
                    });

                    guild = await Guild.findOne({ guildId: message.guild.id }, { partner: 1, subscriptions: 1 });
                    user = await User.findOne({ user: message.author.id }, { amount: 1, inventory: 1 });
                    await msg.edit({
                        embeds: [get_embed()],
                        components: get_components()
                    }).catch(() => { });
                };
            } else if (i.customId === 'shop.sell_mode') {
                sell_mode = !sell_mode;
                await i.update({
                    embeds: [get_embed()],
                    components: get_components()
                });
            } else if (i.customId.startsWith('shop.sell-')) {
                const product = products.slice((page - 1) * per_page, page * per_page)[Number(i.customId.split('-')[1])];

                if (product.id === 'partner_url') {
                    collector.resetTimer();
                    await i.message.edit({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({ name: `${locale('_global.are_you_sure')} — ${message.author.displayName}`, iconURL: message.author.displayAvatarURL() })
                                .setFooter({ text: locale('_global.pls_fast_response'), iconURL: client.config.icons.timeout })
                                .setColor(client.config.colors.main)
                                .setDescription(locale('commands.shop.modals.sell_url_desc', { amount: String(client.config.prices.partner_url) }))
                                .setTimestamp()
                        ],
                        components: [
                            new ActionRowBuilder<ButtonBuilder>()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('shop.sell_confirm-' + 0 + '-' + product.id + '-' + 0)
                                        .setEmoji(client.config.emojis.success)
                                        .setStyle(ButtonStyle.Success),
                                    new ButtonBuilder()
                                        .setCustomId('shop.sell_deny')
                                        .setEmoji(client.config.emojis.error)
                                        .setStyle(ButtonStyle.Secondary)
                                )
                        ]
                    });

                    return;
                };

                collector.resetTimer();

                const create_modal = new client.managers.ModalManager(client, i);
                const modal = await create_modal.build(`shop.sell-${Math.floor(Math.random() * 1000)}`, {
                    modal: new ModalBuilder()
                        .setTitle(locale('commands.shop.modals.title'))
                        .addComponents(
                            new ActionRowBuilder<TextInputBuilder>()
                                .addComponents(
                                    new TextInputBuilder()
                                        .setCustomId('shop.sell_amount_interaction.input')
                                        .setLabel(locale('commands.inventory.modals.input_label'))
                                        .setPlaceholder('Max: 100')
                                        .setStyle(TextInputStyle.Short)
                                        .setMaxLength(user?.inventory?.find(i => i.id === product.id)?.total ?? 0)
                                        .setRequired(true)
                                )
                        )
                });

                const v = modal.fields.getTextInputValue('shop.sell_amount_interaction.input');
                const modal_interaction = await ModalUtils(client, modal, true);

                if (!user || !user?.inventory?.find(i => i.id === product.id) || (user?.inventory?.find(i => i.id === product.id)?.total ?? 0) < Number(v)) {
                    await modal_interaction.error(locale('commands.shop.errors.not_enough_item', { item: product.name }));

                    return;
                };

                const tax = Math.floor((client.config.prices.sell_tax * product.price * Number(v)) / 100);
                const total = (product.price * Number(v)) - tax;
                await modal.deferUpdate();

                await i.message.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: `${locale('_global.are_you_sure')} — ${message.author.displayName}`, iconURL: message.author.displayAvatarURL() })
                            .setFooter({ text: locale('_global.pls_fast_response'), iconURL: client.config.icons.timeout })
                            .setColor(client.config.colors.main)
                            .setDescription(locale('commands.shop.modals.sell_desc', { item: product.name, price: String(product.price * Number(v)), tax: String(total) }))
                            .setTimestamp()
                    ],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('shop.sell_confirm-' + total + '-' + product.id + '-' + v)
                                    .setEmoji(client.config.emojis.success)
                                    .setStyle(ButtonStyle.Success),
                                new ButtonBuilder()
                                    .setCustomId('shop.sell_deny')
                                    .setEmoji(client.config.emojis.error)
                                    .setStyle(ButtonStyle.Secondary)
                            )
                    ]
                });
            } else if (i.customId === 'shop.sell_deny') {
                collector.resetTimer();
                await i.update({
                    embeds: [get_embed()],
                    components: get_components()
                });
            } else if (i.customId.startsWith('shop.sell_confirm-')) {
                const total = Number(i.customId.split('-')[1]);
                const product_id = i.customId.split('-')[2];
                const value = Number(i.customId.split('-')[3]);

                if (product_id === 'partner_url') {
                    const product = products.find(x => x.id === product_id);
                    if (!product) {
                        await i.update({
                            embeds: [get_embed(true)],
                            components: get_components()
                        });

                        return;
                    };

                    await Guild.updateOne({ guildId: message.guild.id }, {
                        $set: {
                            'partner.specialUrl': null,
                            'partner.specialUrlMs': null,
                            'partner.specialUrlDate': null
                        }
                    }, { upsert: true });

                    guild = await Guild.findOne({ guildId: message.guild.id }, { partner: 1, subscriptions: 1 });

                    await i.update({
                        embeds: [get_embed()],
                        components: get_components()
                    });
                    return;
                };

                user = await User.findOne({ user: message.author.id }, { amount: 1, inventory: 1 });
                const product = products.find(x => x.id === product_id);
                if (!product) {
                    await i.update({
                        embeds: [get_embed(true)],
                        components: get_components()
                    });

                    return;
                };

                if (user?.inventory?.find(i => i.id === product.id)?.total - value < 1) {
                    await User.updateOne({ user: message.author.id }, {
                        $pull: {
                            inventory: {
                                id: product.id
                            }
                        },
                        $push: {
                            history: {
                                reason: 'shop.sell',
                                amount: total,
                                staff: 'System',
                                date: Date.now()
                            }
                        },
                        $inc: {
                            amount: total
                        }
                    });

                    await i.update({
                        embeds: [get_embed()],
                        components: get_components()
                    });

                    return;
                };

                await User.updateOne({ user: message.author.id, 'inventory.id': product.id }, {
                    $inc: {
                        'inventory.$.total': -value,
                        amount: total
                    },
                    $push: {
                        history: {
                            reason: 'shop.sell',
                            amount: total,
                            staff: 'System',
                            date: Date.now()
                        }
                    }
                }, { upsert: true });

                user = await User.findOne({ user: message.author.id }, { amount: 1, inventory: 1 });
                await i.update({
                    embeds: [get_embed()],
                    components: get_components()
                });
            }; /*else if (i.customId === 'shop.subscriptions') {
                guild = await Guild.findOne({ guildId: message.guild.id }, { partner: 1, subscriptions: 1 });
                let url_duration: string = locale('commands.shop.subscriptions_not_url');

                if (guild?.partner?.specialUrl) {
                    const remain = guild.partner.specialUrlMs - (Date.now() - guild.partner.specialUrlDate);

                    url_duration = (moment.duration(remain) as any).format(locale('format'));
                };

                await i.update({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.config.colors.main)
                            .setAuthor({ name: `${message.author.displayName} ${locale('commands.shop.subscriptions_author')}`, iconURL: message.author.displayAvatarURL() })
                            .setDescription(locale('commands.shop.subscriptions_desc'))
                            .addFields((locale as any)('commands.shop.subscriptions_fields').map((x: any) => ({
                                name: x.name,
                                value: x.value
                                    .replace('{sub}', String(guild?.subscriptions?.partner_random ?? 0))
                                    .replace('{url}', guild?.partner?.specialUrl ? guild.partner.specialUrl : locale('commands.shop.subscriptions_not_url'))
                                    .replace('{date}', guild?.partner?.specialUrlDate ? `<t:${Math.floor(guild.partner.specialUrlDate / 1000)}:R>` : locale('commands.shop.subscriptions_not_url'))
                                    .replace('{duration}', url_duration),
                                inline: true
                            })))
                    ]
                });
            }*/;
        });
    }
};