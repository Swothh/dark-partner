import { Commands } from '../structures';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { User, Guild } from '../models';
import { ModalUtils } from '../utils';

export const Command: Commands = {
    name: 'top',
    description: 'top',
    aliases: ['sıralama', 'siralama', 'leaderboard', 'lb'],
    category: 'test',
    cooldown: 5000,
    run: async (client, message, args, locale) => {
        const [type] = args;
        const types = (locale as any)('commands.leaderboard.array');
        if (!type || (type !== 'vote' && !types.includes(type))) return message.error(locale('commands.leaderboard.invalid_type', { types: types.join(', ') }));

        if (type === 'coin') {
            let page = 1;
            const per_page = 10;

            const data_count = await User.aggregate([
                { $match: { user: { $nin: client.config.main.filtered_top } } },
                { $project: { amount: 1, user: 1 } },
                { $unwind: '$amount' },
                { $group: { _id: null, count: { $sum: 1 } } }
            ]);

            const max_page = Math.ceil(data_count[0].count / per_page);

            const get_embed = async () => {
                let db = await User.aggregate([
                    { $match: { user: { $nin: client.config.main.filtered_top } } },
                    { $project: { amount: 1, user: 1 } },
                    { $unwind: '$amount' },
                    { $sort: { 'amount': -1 } },
                    { $skip: (page - 1) * per_page },
                    { $limit: per_page }
                ]);

                return new EmbedBuilder()
                    .setColor(client.config.colors.main)
                    .setAuthor({ name: message.author.displayName + locale('commands.leaderboard.coin.title'), iconURL: message.author.displayAvatarURL() })
                    .setDescription(
                        db?.length > 0 ?
                            (await Promise.all(db.map(async (u, i) => {
                                const position = (page - 1) * per_page + i + 1;
                                const user = await client.shardManager.eval('GET_USER', { user: u.user }).catch(() => null);

                                return `${position}. **•** **${user?.data?.globalName || 'UNKNOWN'}** *(${user?.data?.username ?? 'UNKNOWN'})* — **${u.amount.toLocaleString()}** ${client.config.emojis.coin}`;
                            }))).join('\n') : locale('commands.leaderboard.coin.no_data')
                    )
                    .setFooter({ text: locale('commands.leaderboard.page', { page: String(page), max_page: String(max_page) }), iconURL: client.config.icons.page })
                    .setTimestamp();
            };

            const get_components = () => new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('lb.prev')
                        .setEmoji(client.config.emojis.previous)
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === 1),
                    new ButtonBuilder()
                        .setCustomId('lb.next')
                        .setEmoji(client.config.emojis.next)
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === max_page),
                    new ButtonBuilder()
                        .setCustomId('lb.skip')
                        .setLabel(locale('commands.leaderboard.skip'))
                        .setStyle(ButtonStyle.Secondary)
                );

            const msg = await message.channel.send({
                embeds: [await get_embed()],
                components: [get_components()]
            });

            const collector = client.managers.Collector({
                msg,
                channel: message.channel,
                time: 60000,
                filter: i => i.user.id === message.author.id && i.message.id === msg.id,
            });

            collector.on('collect', async (i) => {
                if (!i.isButton()) return;

                if (i.customId === 'lb.prev') {
                    page = Math.max(1, page - 1);
                    await i.update({
                        embeds: [new EmbedBuilder().setColor(client.config.colors.blank).setDescription(locale('commands.leaderboard.coin.loading'))],
                        components: []
                    }).catch(() => { });
                    const getEmbed = await get_embed();
                    await i.message.edit({
                        embeds: [getEmbed],
                        components: [get_components()]
                    }).catch(() => { });
                } else if (i.customId === 'lb.next') {
                    page = Math.min(max_page, page + 1);
                    await i.update({
                        embeds: [new EmbedBuilder().setColor(client.config.colors.blank).setDescription(locale('commands.leaderboard.coin.loading'))],
                        components: []
                    }).catch(() => { });
                    const getEmbed = await get_embed();
                    await i.message.edit({
                        embeds: [getEmbed],
                        components: [get_components()]
                    }).catch(() => { });
                } else if (i.customId === 'lb.skip') {
                    const create_modal = new client.managers.ModalManager(client, i);
                    const modal = await create_modal.build(`lb.skip_modal-${Math.floor(Math.random() * 1000)}`, {
                        modal: new ModalBuilder()
                            .setTitle(locale('commands.leaderboard.coin.modal.title'))
                            .addComponents(
                                new ActionRowBuilder<TextInputBuilder>()
                                    .addComponents(
                                        new TextInputBuilder()
                                            .setCustomId('lb.skip_modal.input')
                                            .setLabel(locale('commands.leaderboard.coin.modal.input'))
                                            .setPlaceholder('12, 24, 35')
                                            .setStyle(TextInputStyle.Short)
                                            .setMaxLength(max_page)
                                            .setRequired(true)
                                    )
                            )
                    });

                    const value = modal.fields.getTextInputValue('lb.skip_modal.input');
                    if (Number(value) > max_page) {
                        await modal.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.config.colors.error)
                                    .setAuthor({ name: `${locale('_global.error')} — ${modal.user.displayName}`, iconURL: modal.user.displayAvatarURL() })
                                    .setDescription(locale('commands.leaderboard.coin.modal.invalid_page', { max_page: String(max_page) }))
                                    .setFooter({ text: locale('_global.error_occured'), iconURL: client.config.icons.error })
                                    .setTimestamp()
                            ],
                            ephemeral: true
                        });
                        return;
                    };

                    page = Math.min(max_page, Number(value));
                    await modal.deferUpdate();
                    await i.message.edit({
                        embeds: [await get_embed()],
                        components: [get_components()]
                    });
                };
            });
        } else if (type === 'partner') {
            let page = 1;
            const per_page = 10;

            const data_count = await Guild.aggregate([
                { $project: { 'guildId': 1, 'partner.total': 1 } },
                { $group: { _id: null, count: { $sum: 1 } } }
            ]);

            const max_page = Math.ceil(data_count[0].count / per_page);

            const get_embed = async () => {
                let db = await Guild.aggregate([
                    { $project: { 'guildId': 1, 'partner.total': 1 } },
                    { $unwind: '$partner.total' },
                    { $sort: { 'partner.total': -1 } },
                    { $skip: (page - 1) * per_page },
                    { $limit: per_page }
                ]);

                return new EmbedBuilder()
                    .setColor(client.config.colors.main)
                    .setAuthor({ name: message.author.displayName + locale('commands.leaderboard.partner.title'), iconURL: message.author.displayAvatarURL() })
                    .setDescription(
                        db?.length > 0 ?
                            (await Promise.all(db.map(async (g, i) => {
                                const position = (page - 1) * per_page + i + 1;
                                const guild = await client.shardManager.eval('GET_GUILD', { guild: g.guildId }).catch(() => null);

                                return `${position}. **•** ${guild?.data?.name ?? 'Unknown'} — **${g.partner.total.toLocaleString()}** :handshake:`;
                            }))).join('\n')
                            : locale('commands.leaderboard.coin.no_data')
                    )
                    .setFooter({ text: locale('commands.leaderboard.page', { page: String(page), max_page: String(max_page) }), iconURL: client.config.icons.page })
                    .setTimestamp();
            };

            const get_components = () => new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('lb.prev')
                        .setEmoji(client.config.emojis.previous)
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === 1),
                    new ButtonBuilder()
                        .setCustomId('lb.next')
                        .setEmoji(client.config.emojis.next)
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === max_page),
                    new ButtonBuilder()
                        .setCustomId('lb.skip')
                        .setLabel(locale('commands.leaderboard.skip'))
                        .setStyle(ButtonStyle.Secondary)
                );

            const msg = await message.channel.send({
                embeds: [await get_embed()],
                components: [get_components()]
            });

            const collector = client.managers.Collector({
                msg,
                channel: message.channel,
                time: 60000,
                filter: i => i.user.id === message.author.id && i.message.id === msg.id,
            });

            collector.on('collect', async (i) => {
                if (!i.isButton()) return;

                if (i.customId === 'lb.prev') {
                    page = Math.max(1, page - 1);
                    await i.update({
                        embeds: [new EmbedBuilder().setColor(client.config.colors.blank).setDescription(locale('commands.leaderboard.coin.loading'))],
                        components: []
                    }).catch(() => { });
                    const getEmbed = await get_embed();
                    await i.message.edit({
                        embeds: [getEmbed],
                        components: [get_components()]
                    }).catch(() => { });
                } else if (i.customId === 'lb.next') {
                    page = Math.min(max_page, page + 1);
                    await i.update({
                        embeds: [new EmbedBuilder().setColor(client.config.colors.blank).setDescription(locale('commands.leaderboard.coin.loading'))],
                        components: []
                    }).catch(() => { });
                    const getEmbed = await get_embed();
                    await i.message.edit({
                        embeds: [getEmbed],
                        components: [get_components()]
                    }).catch(() => { });
                } else if (i.customId === 'lb.skip') {
                    const create_modal = new client.managers.ModalManager(client, i);
                    const modal = await create_modal.build(`lb.skip_modal-${Math.floor(Math.random() * 1000)}`, {
                        modal: new ModalBuilder()
                            .setTitle(locale('commands.leaderboard.coin.modal.title'))
                            .addComponents(
                                new ActionRowBuilder<TextInputBuilder>()
                                    .addComponents(
                                        new TextInputBuilder()
                                            .setCustomId('lb.skip_modal.input')
                                            .setLabel(locale('commands.leaderboard.coin.modal.input'))
                                            .setPlaceholder('12, 24, 35')
                                            .setStyle(TextInputStyle.Short)
                                            .setMaxLength(max_page)
                                            .setRequired(true)
                                    )
                            )
                    });

                    const value = modal.fields.getTextInputValue('lb.skip_modal.input');
                    if (Number(value) > max_page) {
                        await modal.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.config.colors.error)
                                    .setAuthor({ name: `${locale('_global.error')} — ${modal.user.displayName}`, iconURL: modal.user.displayAvatarURL() })
                                    .setDescription(locale('commands.leaderboard.coin.modal.invalid_page', { max_page: String(max_page) }))
                                    .setFooter({ text: locale('_global.error_occured'), iconURL: client.config.icons.error })
                                    .setTimestamp()
                            ],
                            ephemeral: true
                        });
                        return;
                    };

                    page = Math.min(max_page, Number(value));
                    await modal.deferUpdate();
                    await i.message.edit({
                        embeds: [await get_embed()],
                        components: [get_components()]
                    });
                };
            });
        } else if (type === 'vote' || type === 'oy') {
            let page = 1;
            const per_page = 10;

            const data_count = await User.aggregate([
                { $match: { user: { $nin: [] } } },
                { $project: { 'vote.amount': 1, user: 1 } },
                { $unwind: '$vote.amount' },
                { $group: { _id: null, count: { $sum: 1 } } }
            ]);

            const max_page = Math.ceil(data_count[0].count / per_page);

            const get_embed = async () => {
                let db = await User.aggregate([
                    { $match: { user: { $nin: [] } } },
                    { $project: { 'vote.amount': 1, user: 1 } },
                    { $unwind: '$vote.amount' },
                    { $sort: { 'vote.amount': -1 } },
                    { $skip: (page - 1) * per_page },
                    { $limit: per_page }
                ]);

                return new EmbedBuilder()
                    .setColor(client.config.colors.main)
                    .setAuthor({ name: message.author.displayName + locale('commands.leaderboard.vote.title'), iconURL: message.author.displayAvatarURL() })
                    .setDescription(
                        db?.length > 0 ?
                            (await Promise.all(db.map(async (u, i) => {
                                const position = (page - 1) * per_page + i + 1;
                                const user = await client.shardManager.eval('GET_USER', { user: u.user }).catch(() => null);

                                return `${position}. **•** **${user?.data?.globalName || 'UNKNOWN'}** *(${user?.data?.username ?? 'UNKNOWN'})* **${u.vote.amount.toLocaleString()}** ${client.config.emojis.vote}`;
                            }))).join('\n') : locale('commands.leaderboard.coin.no_data')
                    )
                    .setFooter({ text: locale('commands.leaderboard.page', { page: String(page), max_page: String(max_page) }), iconURL: client.config.icons.page })
                    .setTimestamp();
            };

            const get_components = () => new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('lb.prev')
                        .setEmoji(client.config.emojis.previous)
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === 1),
                    new ButtonBuilder()
                        .setCustomId('lb.next')
                        .setEmoji(client.config.emojis.next)
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === max_page),
                    new ButtonBuilder()
                        .setCustomId('lb.skip')
                        .setLabel(locale('commands.leaderboard.skip'))
                        .setStyle(ButtonStyle.Secondary)
                );

            const msg = await message.channel.send({
                embeds: [await get_embed()],
                components: [get_components()]
            });

            const collector = client.managers.Collector({
                msg,
                channel: message.channel,
                time: 60000,
                filter: i => i.user.id === message.author.id && i.message.id === msg.id,
            });

            collector.on('collect', async (i) => {
                if (!i.isButton()) return;

                if (i.customId === 'lb.prev') {
                    page = Math.max(1, page - 1);
                    await i.update({
                        embeds: [new EmbedBuilder().setColor(client.config.colors.blank).setDescription(locale('commands.leaderboard.coin.loading'))],
                        components: []
                    }).catch(() => { });
                    const getEmbed = await get_embed();
                    await i.message.edit({
                        embeds: [getEmbed],
                        components: [get_components()]
                    }).catch(() => { });
                } else if (i.customId === 'lb.next') {
                    page = Math.min(max_page, page + 1);
                    await i.update({
                        embeds: [new EmbedBuilder().setColor(client.config.colors.blank).setDescription(locale('commands.leaderboard.coin.loading'))],
                        components: []
                    }).catch(() => { });
                    const getEmbed = await get_embed();
                    await i.message.edit({
                        embeds: [getEmbed],
                        components: [get_components()]
                    }).catch(() => { });
                } else if (i.customId === 'lb.skip') {
                    const create_modal = new client.managers.ModalManager(client, i);
                    const modal = await create_modal.build(`lb.skip_modal-${Math.floor(Math.random() * 1000)}`, {
                        modal: new ModalBuilder()
                            .setTitle(locale('commands.leaderboard.coin.modal.title'))
                            .addComponents(
                                new ActionRowBuilder<TextInputBuilder>()
                                    .addComponents(
                                        new TextInputBuilder()
                                            .setCustomId('lb.skip_modal.input')
                                            .setLabel(locale('commands.leaderboard.coin.modal.input'))
                                            .setPlaceholder('12, 24, 35')
                                            .setStyle(TextInputStyle.Short)
                                            .setMaxLength(max_page)
                                            .setRequired(true)
                                    )
                            )
                    });

                    const value = modal.fields.getTextInputValue('lb.skip_modal.input');
                    if (Number(value) > max_page) {
                        await modal.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.config.colors.error)
                                    .setAuthor({ name: `${locale('_global.error')} — ${modal.user.displayName}`, iconURL: modal.user.displayAvatarURL() })
                                    .setDescription(locale('commands.leaderboard.coin.modal.invalid_page', { max_page: String(max_page) }))
                                    .setFooter({ text: locale('_global.error_occured'), iconURL: client.config.icons.error })
                                    .setTimestamp()
                            ],
                            ephemeral: true
                        });
                        return;
                    };

                    page = Math.min(max_page, Number(value));
                    await modal.deferUpdate();
                    await i.message.edit({
                        embeds: [await get_embed()],
                        components: [get_components()]
                    });
                };
            });
        } else if (type === 'streak') {
            let page = 1;
            const per_page = 10;

            const data_count = await User.aggregate([
                { $match: { user: { $nin: [] } } },
                { $project: { 'vote.streak': 1, user: 1 } },
                { $unwind: '$vote.streak' },
                { $group: { _id: null, count: { $sum: 1 } } }
            ]);

            const max_page = Math.ceil(data_count[0].count / per_page);

            const get_embed = async () => {
                let db = await User.aggregate([
                    { $match: { user: { $nin: [] } } },
                    { $project: { 'vote.streak': 1, user: 1 } },
                    { $unwind: '$vote.streak' },
                    { $sort: { 'vote.streak': -1 } },
                    { $skip: (page - 1) * per_page },
                    { $limit: per_page }
                ]);

                return new EmbedBuilder()
                    .setColor(client.config.colors.main)
                    .setAuthor({ name: message.author.displayName + locale('commands.leaderboard.streak.title'), iconURL: message.author.displayAvatarURL() })
                    .setDescription(
                        db?.length > 0 ?
                            (await Promise.all(db.map(async (u, i) => {
                                const position = (page - 1) * per_page + i + 1;
                                const user = await client.shardManager.eval('GET_USER', { user: u.user }).catch(() => null);

                                return `${position}. **•** **${user?.data?.globalName || 'UNKNOWN'}** *(${user?.data?.username ?? 'UNKNOWN'})* **${u.vote.streak.toLocaleString()}** ${client.config.emojis.streak}`;
                            }))).join('\n') : locale('commands.leaderboard.coin.no_data')
                    )
                    .setFooter({ text: locale('commands.leaderboard.page', { page: String(page), max_page: String(max_page) }), iconURL: client.config.icons.page })
                    .setTimestamp();
            };

            const get_components = () => new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('lb.prev')
                        .setEmoji(client.config.emojis.previous)
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === 1),
                    new ButtonBuilder()
                        .setCustomId('lb.next')
                        .setEmoji(client.config.emojis.next)
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === max_page),
                    new ButtonBuilder()
                        .setCustomId('lb.skip')
                        .setLabel(locale('commands.leaderboard.skip'))
                        .setStyle(ButtonStyle.Secondary)
                );

            const msg = await message.channel.send({
                embeds: [await get_embed()],
                components: [get_components()]
            });

            const collector = client.managers.Collector({
                msg,
                channel: message.channel,
                time: 60000,
                filter: i => i.user.id === message.author.id && i.message.id === msg.id,
            });

            collector.on('collect', async (i) => {
                if (!i.isButton()) return;

                if (i.customId === 'lb.prev') {
                    page = Math.max(1, page - 1);
                    await i.update({
                        embeds: [new EmbedBuilder().setColor(client.config.colors.blank).setDescription(locale('commands.leaderboard.coin.loading'))],
                        components: []
                    }).catch(() => { });
                    const getEmbed = await get_embed();
                    await i.message.edit({
                        embeds: [getEmbed],
                        components: [get_components()]
                    }).catch(() => { });
                } else if (i.customId === 'lb.next') {
                    page = Math.min(max_page, page + 1);
                    await i.update({
                        embeds: [new EmbedBuilder().setColor(client.config.colors.blank).setDescription(locale('commands.leaderboard.coin.loading'))],
                        components: []
                    }).catch(() => { });
                    const getEmbed = await get_embed();
                    await i.message.edit({
                        embeds: [getEmbed],
                        components: [get_components()]
                    }).catch(() => { });
                } else if (i.customId === 'lb.skip') {
                    const create_modal = new client.managers.ModalManager(client, i);
                    const modal = await create_modal.build(`lb.skip_modal-${Math.floor(Math.random() * 1000)}`, {
                        modal: new ModalBuilder()
                            .setTitle(locale('commands.leaderboard.coin.modal.title'))
                            .addComponents(
                                new ActionRowBuilder<TextInputBuilder>()
                                    .addComponents(
                                        new TextInputBuilder()
                                            .setCustomId('lb.skip_modal.input')
                                            .setLabel(locale('commands.leaderboard.coin.modal.input'))
                                            .setPlaceholder('12, 24, 35')
                                            .setStyle(TextInputStyle.Short)
                                            .setMaxLength(max_page)
                                            .setRequired(true)
                                    )
                            )
                    });

                    const value = modal.fields.getTextInputValue('lb.skip_modal.input');
                    if (Number(value) > max_page) {
                        await modal.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(client.config.colors.error)
                                    .setAuthor({ name: `${locale('_global.error')} — ${modal.user.displayName}`, iconURL: modal.user.displayAvatarURL() })
                                    .setDescription(locale('commands.leaderboard.coin.modal.invalid_page', { max_page: String(max_page) }))
                                    .setFooter({ text: locale('_global.error_occured'), iconURL: client.config.icons.error })
                                    .setTimestamp()
                            ],
                            ephemeral: true
                        });
                        return;
                    };

                    page = Math.min(max_page, Number(value));
                    await modal.deferUpdate();
                    await i.message.edit({
                        embeds: [await get_embed()],
                        components: [get_components()]
                    });
                };
            });
        };
    }
};