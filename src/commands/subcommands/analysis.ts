import { Commands } from '../../structures';
import { Guild } from '../../models';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import ChartJSImage from 'chart.js-image';

export const Analysis: Commands['run'] = async (client, message, args, locale) => {
    const guildId = message.guild.id;
    let guild = await Guild.findOne({ guildId }, { 'partner.users': true });

    client.utils.duplicates(guild.partner.users.map(u => u.user)).forEach(async user => {
        const duplicateUsers = guild.partner.users.filter(u => u.user === user);

        if (duplicateUsers.length > 1) {
            const mergedUserData = mergeUserDatas(duplicateUsers);

            const filtered = guild.partner.users.filter(u => u.user !== user);
            filtered.push(mergedUserData);

            await Guild.updateOne({ guildId }, { $set: { 'partner.users': filtered } });
        };

        guild = await Guild.findOne({ guildId }, { 'partner.users': true });
    });

    function mergeUserDatas(users: any) {
        const mergedUserData: any = {};

        users.forEach((user: any) => {
            const userData = user.data;

            Object.keys(userData).forEach(date => {
                if (!mergedUserData[date]) {
                    mergedUserData[date] = userData[date];
                } else {
                    mergedUserData[date] += userData[date];
                };
            });
        });

        const total = Object.values(mergedUserData).reduce((a: any, b) => a + b, 0);

        return [
            {
                user: users[0].user,
                data: mergedUserData,
                total: (total as any)
            }
        ][0];
    };

    if (!guild || !(guild.partner?.users ?? [])?.length) return message.error(locale('commands.partner.analysis.no_data'));

    let page = 1;
    let per_page = 10;
    let users = guild.partner.users.slice((page - 1) * per_page, page * per_page);
    const max_page = Math.ceil(guild.partner.users.length / per_page);

    const get_embed = async () => {
        guild = await Guild.findOne({ guildId: message.guild.id }, { 'partner.users': true });

        const labels: any = [];
        users.forEach(user => {
            const userData = user.data;

            Object.keys(userData).forEach(date => {
                if (!labels.includes(date)) {
                    labels.push(date);
                };
            });
        });

        const latestLabels = labels.slice().sort((a: any, b: any) => {
            const dateParts = a.split('.');
            const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            const dateObject = new Date(formattedDate);

            const dateParts2 = b.split('.');
            const formattedDate2 = `${dateParts2[2]}-${dateParts2[1]}-${dateParts2[0]}`;
            const dateObject2 = new Date(formattedDate2);

            return dateObject2.getTime() - dateObject.getTime();
        }).slice(0, 7).reverse();

        const datasets: any = [];
        users.forEach(user => {
            const userData = user.data;
            const dataValues = latestLabels.map((date: any) => userData[date] || 0);
            const member = message.guild.members.cache.get(user.user);

            datasets.push({
                "label": `${member?.displayName ?? 'Unknown'}`,
                "data": dataValues,
                "borderColor": `rgba(${Math.floor(Math.random() * 186) + 70}, ${Math.floor(Math.random() * 186) + 70}, ${Math.floor(Math.random() * 186) + 70}, 0.7)`,
                "backgroundColor": 'rgba(0, 0, 0, 0.2)',
            });
        });


        // @ts-ignore
        const line_chart = ChartJSImage().chart({
            "type": "line",
            "data": {
                "labels": latestLabels,
                "datasets": datasets
            },
            "options": {
                "title": {
                    "display": false,
                    "text": "Chart.js Line Chart"
                }
            }
        }).backgroundColor('transparent').width(600);

        const attachment = new AttachmentBuilder(await line_chart.toBuffer(), { name: 'analysis.png' });
        const embed = new EmbedBuilder()
            .setColor(client.config.colors.main)
            .setAuthor({ name: locale('commands.partner.analysis.author', { guild: message.guild.name }), iconURL: message.guild.iconURL() })
            .setTitle(locale('commands.partner.analysis.title'))
            .setDescription(guild.partner.users.sort((a, b) => b.total - a.total).map((u, i) => {
                const position = (page - 1) * per_page + i + 1;

                return `${position}. <@${u.user}> - ${u.total}`;
            }).join('\n') ?? locale('commands.partner.analysis.no_data'))
            .setFooter({ text: locale('commands.partner.analysis.footer'), iconURL: client.config.icons.warning })
            .setImage('attachment://analysis.png')
            .setTimestamp()

        return {
            embeds: [embed],
            files: [attachment]
        };
    };

    const get_components = (d?: boolean) => {
        const check_perm = message.member.permissions.has('Administrator');
        const components = !d ? [
            new ActionRowBuilder<StringSelectMenuBuilder>()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('partner_analysis.select')
                        .setPlaceholder(locale('commands.partner.analysis.select_placeholder'))
                        .addOptions(
                            ...users.map((user, i) => new StringSelectMenuOptionBuilder()
                                .setLabel(`${message.guild.members.cache.get(user.user)?.displayName ?? 'Unknown'}`)
                                .setDescription(locale('commands.partner.analysis.select_description', { user: message.guild.members.cache.get(user.user)?.displayName ?? 'Unknown' }))
                                .setValue(user.user)
                                .setEmoji(client.config.emojis.user)
                            )
                        )
                ),
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('partner_analysis.prev')
                        .setEmoji(client.config.emojis.previous)
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === 1),
                    new ButtonBuilder()
                        .setCustomId('partner_analysis.next')
                        .setEmoji(client.config.emojis.next)
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === max_page),
                    new ButtonBuilder()
                        .setCustomId('partner_analysis.skip')
                        .setLabel(locale('commands.leaderboard.skip'))
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('partner_analysis.reset')
                        .setLabel(locale('commands.partner.analysis.reset'))
                        .setDisabled(check_perm ? false : true)
                        .setStyle(ButtonStyle.Secondary)
                )
        ] : [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('partner_analysis.back')
                        .setEmoji(client.config.emojis.back)
                        .setStyle(ButtonStyle.Secondary)
                )
        ];

        return components;
    };

    const msg = await message.channel.send({
        ...await get_embed(),
        components: get_components()
    });

    const collector = client.managers.Collector({
        msg,
        channel: message.channel,
        time: 60000,
        filter: i => i.user.id === message.author.id && i.message.id === msg.id,
    });

    collector.on('collect', async i => {
        if (!i.isButton() && !i.isStringSelectMenu()) return;

        if (i.customId === 'partner_analysis.prev') {
            page = Math.max(1, page - 1);
            await i.update({
                ...await get_embed(),
                components: get_components()
            }).catch(() => { });
        } else if (i.customId === 'partner_analysis.next') {
            page = Math.min(max_page, page + 1);
            await i.update({
                ...await get_embed(),
                components: get_components()
            }).catch(() => { });
        } else if (i.customId === 'partner_analysis.back') {
            users = guild.partner.users.slice((page - 1) * per_page, page * per_page);
            await i.update({
                ...await get_embed(),
                components: get_components()
            }).catch(() => { });
        } else if (i.customId === 'partner_analysis.reset') {
            collector.resetTimer();
            await i.message.edit({
                files: [],
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: `${locale('_global.are_you_sure')} — ${message.author.displayName}`, iconURL: message.author.displayAvatarURL() })
                        .setFooter({ text: locale('_global.pls_fast_response'), iconURL: client.config.icons.timeout })
                        .setColor(client.config.colors.main)
                        .setDescription(locale('commands.partner.analysis.reset_data_desc', { amount: String(guild.partner.users.length) }))
                        .setTimestamp()
                ],
                components: [
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('analysis.reset_confirm')
                                .setEmoji(client.config.emojis.success)
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setCustomId('analysis.reset_deny')
                                .setEmoji(client.config.emojis.error)
                                .setStyle(ButtonStyle.Secondary)
                        )
                ]
            });
        } else if (i.customId === 'partner_analysis.skip') {
            const create_modal = new client.managers.ModalManager(client, i);
            const modal = await create_modal.build(`partner_analysis.skip_modal - ${Math.floor(Math.random() * 1000)}`, {
                modal: new ModalBuilder()
                    .setTitle(locale('commands.leaderboard.coin.modal.title'))
                    .addComponents(
                        new ActionRowBuilder<TextInputBuilder>()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId('partner_analysis.skip_modal.input')
                                    .setLabel(locale('commands.leaderboard.coin.modal.input'))
                                    .setPlaceholder('12, 24, 35')
                                    .setStyle(TextInputStyle.Short)
                                    .setMaxLength(max_page)
                                    .setRequired(true)
                            )
                    )
            });

            const value = modal.fields.getTextInputValue('partner_analysis.skip_modal.input');
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
                ...await get_embed(),
                components: get_components()
            }).catch(() => { });
        } else if (i.customId === 'partner_analysis.select' && i.isStringSelectMenu()) {
            const value = i.values[0];
            const user = await message.guild.members.fetch(value).catch(() => { });
            if (!user) return;

            users = guild.partner.users.filter(u => u.user === value);
            guild = await Guild.findOne({ guildId: message.guild.id }, { 'partner.users': true });
            const labels: any = [];

            users.forEach(user => {
                const userData = user.data;

                Object.keys(userData).forEach(date => {
                    if (!labels.includes(date)) {
                        labels.push(date);
                    };
                });
            });

            const latestLabels = labels.slice().sort((a: any, b: any) => {
                const dateParts = a.split('.');
                const formattedDate = `${dateParts[2]} - ${dateParts[1]} - ${dateParts[0]}`;
                const dateObject = new Date(formattedDate);

                const dateParts2 = b.split('.');
                const formattedDate2 = `${dateParts2[2]} - ${dateParts2[1]} - ${dateParts2[0]}`;
                const dateObject2 = new Date(formattedDate2);

                return dateObject2.getTime() - dateObject.getTime();
            }).slice(0, 7).reverse();

            const datasets: any = [];
            users.forEach(user => {
                const userData = user.data;
                const dataValues = latestLabels.map((date: any) => userData[date] || 0);
                const member = message.guild.members.cache.get(user.user);

                datasets.push({
                    "label": `${member?.displayName ?? 'Unknown'}`,
                    "data": dataValues,
                    "borderColor": `rgba(${Math.floor(Math.random() * 186) + 70}, ${Math.floor(Math.random() * 186) + 70}, ${Math.floor(Math.random() * 186) + 70}, 0.7)`,
                    "backgroundColor": 'rgba(0, 0, 0, 0.2)',
                });
            });


            // @ts-ignore
            const line_chart = ChartJSImage().chart({
                "type": "line",
                "data": {
                    "labels": latestLabels,
                    "datasets": datasets
                },
                "options": {
                    "title": {
                        "display": false,
                        "text": "Chart.js Line Chart"
                    }
                }
            }).backgroundColor('transparent').width(600);

            const attachment = new AttachmentBuilder(await line_chart.toBuffer(), { name: 'analysis.png' });
            const yesterday = users[0]?.data[new Date(new Date().getTime() - 1000 * 60 * 60 * 24).toLocaleDateString('en-US').replaceAll('/', '.')];
            const today = users[0]?.data[new Date().toLocaleDateString('en-US').replaceAll('/', '.')];
            const status = today > yesterday ? locale('commands.partner.analysis.up') : today < yesterday ? locale('commands.partner.analysis.down') : locale('commands.partner.analysis.same');

            const embed = new EmbedBuilder()
                .setColor(client.config.colors.main)
                .setAuthor({ name: locale('commands.partner.analysis.author_selected', { user: user.displayName }), iconURL: user.displayAvatarURL() })
                .addFields((locale as any)('commands.partner.analysis.fields').map((field: any) => ({
                    name: field.name,
                    value: field.value
                        .replace('{total}', users[0]?.total)
                        .replace('{today}', Object.entries(users[0]?.data || {})?.filter((d: any) => d === new Date().toLocaleDateString('en-US').replaceAll('/', '.')).reduce((a: any, b) => a + (b[1] || 0), 0))
                        .replace('{week}', Object.entries(users[0]?.data || {}).filter((d: any) => {
                            const dateString = d[0];
                            const dateParts = dateString.split(".");
                            const formattedDate = `${dateParts[2]} -${dateParts[1]} -${dateParts[0]} `;
                            const dateObject = new Date(formattedDate);

                            return ((new Date().getTime() - dateObject.getTime())) < 1000 * 60 * 60 * 24 * 7; // 1 hafta
                        }).reduce((a: any, b) => a + (b[1] || 0), 0) ?? 0)
                        .replace('{coin}', String(users[0]?.total * client.config.prices.partnership.user))
                        .replace('{total_user}', String(guild.partner.users.length))
                        .replace('{rank}', String(guild.partner.users.sort((a, b) => b.total - a.total).findIndex(u => u.user === value) + 1))
                        .replace('{status}', status),
                    inline: field.inline ?? false
                })))
                .setImage('attachment://analysis.png')
                .setFooter({ text: locale('commands.partner.analysis.selected_footer', { coin: String(users[0]?.total * client.config.prices.partnership.user) }), iconURL: client.config.icons.coin })
                .setTimestamp()

            await i.update({
                embeds: [embed],
                files: [attachment],
                components: get_components(true)
            }).catch(() => { });
        } else if (i.customId === 'analysis.reset_confirm') {
            await Guild.updateOne({ guildId: message.guild.id }, { $set: { 'partner.users': [] } });
            await i.update({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.colors.success)
                        .setAuthor({ name: `${locale('_global.success')} — ${message.author.displayName}`, iconURL: message.author.displayAvatarURL() })
                        .setDescription(locale('commands.partner.analysis.reset_success'))
                        .setFooter({ text: locale('_global.success_occured'), iconURL: client.config.icons.success })
                        .setTimestamp()
                ],
                components: []
            }).catch(() => { });
        } else if (i.customId === 'analysis.reset_deny') {
            await i.message.edit({
                ...await get_embed(),
                components: get_components()
            }).catch(() => { });
        };
    });
};