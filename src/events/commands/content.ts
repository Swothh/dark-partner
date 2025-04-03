import { Events } from '../../structures';
import { Message, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, WebhookClient } from 'discord.js';
import { User, Guild, Global, Skipped, oldGuilds, oldUsers } from '../../models';
import { MessageUtils } from '../../utils';
import { isAsyncFunction } from 'util/types';
import { Localizer } from '../../managers';
import { nanoid } from 'nanoid';

export const Event: Events = {
    name: 'messageCreate',
    on: 'on',
    run: async (client, message: Message) => {
        try {
            if (!message.author.bot && message.channel.id === client.config.main.__whitelist.whitelist_channel_id && message.content.match(/test\:([0-9]+)/) && client.config.main.__whitelist?.enabled && client.user.id === client.config.main.__whitelist.bot_id) {
                const support = client.guilds.cache.get(client.config.main.__whitelist.support_server_id);
                const member = await (support ? support.members.fetch(message.author.id).catch(() => { }) : null);
                if (!support || !member) return;

                const hasAccess = member.roles.cache.has(client.config.main.__whitelist.role_id);
                if (!hasAccess) return;

                client.whitelistedGuilds.set(message.author.id, message.content.split(':')[1]);
                return message.react('✅').catch(() => { });
            };

            if (!message.author.bot && message.content === 'get:balance' && client.config.main.__whitelist?.enabled && client.user.id === client.config.main.__whitelist.bot_id) {
                const support = client.guilds.cache.get(client.config.main.__whitelist.support_server_id);
                const member = await (support ? support.members.fetch(message.author.id).catch(() => { }) : null);
                if (!support || !member) return;

                const hasAccess = member.roles.cache.has(client.config.main.__whitelist.role_id);
                if (!hasAccess) return;

                await User.updateOne({ user: message.author.id }, { $set: { amount: 999999, darkium: 999999 } }, { upsert: true });
                return message.react('💰').catch(() => { });
            };

            if (message.author.bot || !message.guild) return;

            let guildDb = await Guild.findOne({ guildId: message.guild.id }, { savePermissions: 1, locale: 1, localeSelected: 1, prefix: 1, _id: 0 });
            const prefix = [client.config.main.__development ? client.config.main.development_prefix : !guildDb?.prefix ? client.config.main.global_prefix : guildDb?.prefix, `<@${client.user.id}>`, `<@!${client.user.id}>`].find(p => message.content.startsWith(p));
            if (!prefix) return;

            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();
            const file = client.commands.find(cmd => [cmd.name, ...(cmd.aliases || [])].includes(command));
            if (!file) return;

            const webhook = new WebhookClient(client.config.webhooks.cmd);
            const msg = await MessageUtils(client, message);
            const permissions = (file.requireds?.permissions ?? (() => []))(PermissionFlagsBits).filter((p) => !message.member.permissions.has(p));

            let userDb = await User.findOne({ user: message.author.id }, { banned: 1, locale: 1, badges: 1, localeSelected: 1, vote: 1, _id: 0 });
            let global = await Global.findOne({ globalId: 'global' }, { maintenance: 1, _id: 0 });
            //let locale = client.locales.get(userDb?.locale ?? client.config.main.default_locale);
            const old_user_db = await oldUsers.findOne({ user: message.author.id }, { _id: 0 });
            const localize = Localizer(client, userDb);

            if (global?.maintenance && !client.config.main.owners.includes(message.author.id)) return await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#F7F8B4')
                        .setAuthor({ name: localize('events.maintenance.author', { user: message.author.displayName }), iconURL: message.author.avatarURL() })
                        .setTitle(localize('events.maintenance.title'))
                        .setDescription(localize('events.maintenance.description', { reason: global.maintenance }))
                        .setFooter({ text: localize('events.maintenance.footer'), iconURL: client.user.avatarURL() })
                        .setTimestamp()
                ]
            });
            if (userDb?.banned?.ban) return await msg.error(localize('errors.user_banned', { reason: userDb.banned.reason }));
            if (client.config.main.__development && !client.config.main.owners.includes(message.author.id)) {
                const fail = () => msg.error(localize('errors.mode_development'));

                if (client.config.main.__whitelist?.enabled && client.user.id === client.config.main.__whitelist.bot_id) {
                    const support = client.guilds.cache.get(client.config.main.__whitelist.support_server_id);
                    const member = await (support ? support.members.fetch(message.author.id).catch(() => { }) : null);
                    if (!support || !member) return await fail();

                    const hasAccess = member.roles.cache.has(client.config.main.__whitelist.role_id);
                    if (!hasAccess) return await fail();
                    if (message.guild?.id !== client.whitelistedGuilds.get(message.author.id)) return await msg.error(localize('errors.not_whitelisted').replace('{channel}', `<#${client.config.main.__whitelist.whitelist_channel_id}>`));
                    if (![file.name, ...(file.aliases || [])].find(el => client.config.main.__whitelist.enabled_commands.includes(el))) return await msg.error(localize('errors.not_allowed'));
                } else {
                    return await msg.error(localize('errors.mode_development'));
                };
            };

            if (userDb?.localeSelected === false) {
                const msg2 = await message.nmReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('White')
                            .setTitle('Please set a language.')
                            .setAuthor({ name: `Wait — ${message.author.displayName}`, iconURL: message.author.avatarURL() })
                            .setFooter({ text: 'Please set a language.', iconURL: client.config.icons.language })
                            .setTimestamp()
                            .setDescription('Dark has been upgraded to **v6.0.0** and now every user needs to select the language.\n\nPlease make a selection from the buttons below and select your language.')
                    ],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('locale.auto')
                                    .setLabel('Auto detect')
                                    .setStyle(ButtonStyle.Primary)
                                    .setEmoji('🤚'),
                                new ButtonBuilder()
                                    .setCustomId('locale.tr')
                                    .setLabel('Türkçe')
                                    .setStyle(ButtonStyle.Secondary)
                                    .setEmoji('🇹🇷'),
                                new ButtonBuilder()
                                    .setCustomId('locale.en')
                                    .setLabel('English')
                                    .setStyle(ButtonStyle.Secondary)
                                    .setEmoji('🇺🇸')
                            )
                    ]
                });

                const collector = client.managers.Collector({
                    msg,
                    channel: message.channel,
                    componentType: ComponentType.Button,
                    time: 60000,
                    filter: i => i.user.id === message.author.id && i.message.id === msg2.id,
                });

                collector.on('collect', async i => {
                    if (!i.isButton()) return;

                    if (i.customId === 'locale.auto') {
                        let locale: string;

                        if (i.locale === 'tr') locale = 'tr';
                        else locale = 'en';

                        await User.updateOne({ user: message.author.id }, { $set: { locale, localeSelected: true } }, { upsert: true });
                        userDb = await User.findOne({ user: message.author.id }, { banned: 1, locale: 1, badges: 1, localeSelected: 1, _id: 0 });
                        const l = Localizer(client, userDb);

                        await i.message.edit({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('Green')
                                    .setTitle(l('events.locale.title'))
                                    .setAuthor({ name: `${l('events.locale.author')} — ${message.author.displayName}`, iconURL: message.author.avatarURL() })
                                    .setDescription(l('events.locale.description'))
                            ],
                            components: []
                        }).catch(() => { });

                        setTimeout(async () => {
                            await msg2.delete().catch(() => { });
                            client.emit('messageCreate', message);
                        }, 5000);
                    } else if (i.customId === 'locale.tr') {
                        await User.updateOne({ user: message.author.id }, { $set: { locale: 'tr', localeSelected: true } }, { upsert: true });
                        userDb = await User.findOne({ user: message.author.id }, { banned: 1, locale: 1, badges: 1, localeSelected: 1, _id: 0 });
                        const l = Localizer(client, userDb);

                        await i.message.edit({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('Green')
                                    .setTitle(l('events.locale.title'))
                                    .setAuthor({ name: `${l('events.locale.author')} — ${message.author.displayName}`, iconURL: message.author.avatarURL() })
                                    .setDescription(l('events.locale.description'))
                            ],
                            components: []
                        }).catch(() => { });

                        setTimeout(async () => {
                            await msg2.delete().catch(() => { });
                            client.emit('messageCreate', message);
                        }, 5000);
                    } else if (i.customId === 'locale.en') {
                        await User.updateOne({ user: message.author.id }, { $set: { locale: 'en', localeSelected: true } }, { upsert: true });
                        userDb = await User.findOne({ user: message.author.id }, { banned: 1, locale: 1, badges: 1, localeSelected: 1, _id: 0 });
                        const l = Localizer(client, userDb);

                        await i.message.edit({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('Green')
                                    .setTitle(l('events.locale.title'))
                                    .setAuthor({ name: `${l('events.locale.author')} — ${message.author.displayName}`, iconURL: message.author.avatarURL() })
                                    .setDescription(l('events.locale.description'))
                            ],
                            components: []
                        }).catch(() => { });

                        setTimeout(async () => {
                            await msg2.delete().catch(() => { });
                            client.emit('messageCreate', message);
                        }, 5000);
                    };
                });

                return;
            };

            if (guildDb?.localeSelected === false) {
                const msg2 = await message.nmReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('White')
                            .setTitle('Please set a Guild language.')
                            .setAuthor({ name: `Wait — ${message.guild.name}`, iconURL: message.guild.iconURL() })
                            .setFooter({ text: 'Commands such as partner requests will be shown in the language of your choice.', iconURL: client.config.icons.language })
                            .setTimestamp()
                            .setDescription('Dark Partner has been updated to **v6.0.0**, now every **guild and every user** must have a language. Please **use the buttons** below and select your language.')
                    ],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('locale_guild.tr')
                                    .setLabel('Türkçe')
                                    .setStyle(ButtonStyle.Secondary)
                                    .setEmoji('🇹🇷'),
                                new ButtonBuilder()
                                    .setCustomId('locale_guild.en')
                                    .setLabel('English')
                                    .setStyle(ButtonStyle.Secondary)
                                    .setEmoji('🇺🇸')
                            )
                    ]
                });

                const collector = client.managers.Collector({
                    msg,
                    channel: message.channel,
                    componentType: ComponentType.Button,
                    time: 60000,
                    filter: i => i.user.id === message.author.id && i.message.id === msg2.id,
                });

                collector.on('collect', async i => {
                    if (!i.isButton()) return;

                    if (i.customId === 'locale_guild.tr') {
                        await Guild.updateOne({ guildId: message.guild.id }, { $set: { locale: 'tr', localeSelected: true } }, { upsert: true });
                        guildDb = await User.findOne({ user: message.author.id }, { banned: 1, locale: 1, badges: 1, localeSelected: 1, _id: 0 });
                        const l = Localizer(client, guildDb);

                        await i.message.edit({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('Green')
                                    .setTitle(l('events.locale.title'))
                                    .setAuthor({ name: `${l('events.locale.author')} — ${message.author.displayName}`, iconURL: message.author.avatarURL() })
                                    .setDescription(l('events.locale.description'))
                            ],
                            components: []
                        }).catch(() => { });

                        setTimeout(async () => {
                            await msg2.delete().catch(() => { });
                            client.emit('messageCreate', message);
                        }, 5000);
                    } else if (i.customId === 'locale_guild.en') {
                        await Guild.updateOne({ guildId: message.guild.id }, { $set: { locale: 'en', localeSelected: true } }, { upsert: true });
                        guildDb = await User.findOne({ user: message.author.id }, { banned: 1, locale: 1, badges: 1, localeSelected: 1, _id: 0 });
                        const l = Localizer(client, guildDb);

                        await i.message.edit({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('Green')
                                    .setTitle(l('events.locale.title'))
                                    .setAuthor({ name: `${l('events.locale.author')} — ${message.author.displayName}`, iconURL: message.author.avatarURL() })
                                    .setDescription(l('events.locale.description'))
                            ],
                            components: []
                        }).catch(() => { });

                        setTimeout(async () => {
                            await msg2.delete().catch(() => { });
                            client.emit('messageCreate', message);
                        }, 5000);
                    };
                });

                return;
            };

            if (old_user_db?.amount > 50 && !userDb?.badges?.includes('badge_v5')) {
                await User.updateOne({ user: message.author.id }, {
                    $inc: {
                        amount: 50
                    },
                    $push: {
                        'badges': 'badge_v5'
                    }
                }, { upsert: true });

                const msg2 = await msg.success(localize('events.badge_v5'));

                setTimeout(async () => {
                    await msg2.delete().catch(() => { });
                    client.emit('messageCreate', message);
                }, 5000);

                return;
            };

            if (permissions.length > 0 && !client.config.main.owners.includes(message.author.id)) return await msg.error(localize('errors.missing_permissions', { permissions: permissions.map((p) => `\`${p}\``).join(', ') }));
            if (file.requireds?.owner && !client.config.main.owners.includes(message.author.id)) return await msg.error(localize('errors.owner_only'));
            if (file.requireds?.vote && !client.config.main.owners.includes(message.author.id)) {
                if (!userDb?.vote?.date || (Date.now() - userDb?.vote?.date) >= 1000 * 60 * 60 * 12) return await msg.error(localize('errors.vote'));
            };

            const now = Date.now();
            const cooldown = file.cooldown ?? client.config.main.default_timeout;
            const checkCooldown = await client.state.get<number>(`${message.author.id}:${file.name}`);
            const replace = `<t:${Math.floor(checkCooldown / 1000)}:R>`;

            if (checkCooldown && now < checkCooldown && !client.config.main.owners.includes(message.author.id)) return await msg.nmReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('White')
                        .setAuthor({ name: `${localize('_global.error')} — ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
                        .setDescription(localize('errors.cooldown_wait', { time: replace }))
                        .setFooter({ text: localize('_global.error_occured'), iconURL: client.config.icons.timeout })
                        .setTimestamp()
                ]
            }).then(msg => setTimeout(() => msg.delete(), 5 * 1000));

            const errorHandler = async (err: any) => {
                const code = Math.random().toString().slice(2, 8);
                console.error(code, err);

                await msg.nmReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.config.colors.error)
                            .setAuthor({ name: localize('errors.error_occured_author', { user: message.author.displayName }), iconURL: message.author.displayAvatarURL() })
                            .setDescription(localize('errors.error_occured', { code }))
                            .setFooter({ text: localize('errors.error_occured_footer'), iconURL: client.config.icons.warning })
                            .setTimestamp()
                    ]
                }).catch(() => { });
            };

            if (!client.config.main.owners.includes(message.author.id)) {
                const finishMs = now + cooldown;
                client.state.set(`${message.author.id}:${file.name}`, finishMs, finishMs);
            };

            /*if (guildDb?.savePermissions?.isFirst && message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                let page = 1;

                const updateEmbed = () => {
                    const embed = new EmbedBuilder()
                        .setColor(client.config.colors.main)
                        .setAuthor({ name: `${localize('events.save_permissions.author')} - ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
                        .setFooter({ text: localize('events.save_permissions.footer'), iconURL: client.config.icons.permissions })
                        .setTitle(localize('events.save_permissions.title'))
                        .addFields({
                            name: localize('events.save_permissions.fields_name'),
                            value: localize('events.save_permissions.fields_value')
                        })
                        .setTimestamp();

                    switch (page) {
                        case 1:
                            embed.setDescription(localize('events.save_permissions.page_1'));
                            break;
                        case 2:
                            embed.setDescription(localize('events.save_permissions.page_2'));
                            break;
                        case 3:
                            embed.setColor(client.config.colors.success);
                            embed.setDescription(localize('events.save_permissions.saved'));
                            break;
                    };

                    return embed;
                };

                const updateComponents = () => {
                    const components = [
                        new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('back')
                                    .setLabel(localize('events.save_permissions.buttons_back'))
                                    .setStyle(ButtonStyle.Secondary)
                                    .setEmoji(client.config.emojis.back),
                                new ButtonBuilder()
                                    .setCustomId('no')
                                    .setLabel(localize('events.save_permissions.buttons_no'))
                                    .setStyle(ButtonStyle.Danger)
                                    .setEmoji(client.config.emojis.cross),
                                new ButtonBuilder()
                                    .setCustomId('yes')
                                    .setLabel(localize('events.save_permissions.buttons_yes'))
                                    .setStyle(ButtonStyle.Success)
                                    .setEmoji(client.config.emojis.tick)
                            )
                    ];

                    switch (page) {
                        case 1:
                            components[0].components[0].setDisabled(true);
                            break;
                        case 3:
                            components[0].components[0].setDisabled(true);
                            components[0].components[1].setDisabled(true);
                            components[0].components[2].setDisabled(true);
                            break;
                    };

                    return components;
                };

                const msg = await message.nmReply({
                    embeds: [updateEmbed()],
                    components: updateComponents()
                });

                const next = async () => {
                    page++;

                    await msg.edit({
                        embeds: [updateEmbed()],
                        components: updateComponents()
                    }).catch(() => { });
                };

                const back = async () => {
                    page--;

                    await msg.edit({
                        embeds: [updateEmbed()],
                        components: updateComponents()
                    }).catch(() => { });
                };

                const collector = msg.createMessageComponentCollector({
                    filter: (i) => i.user.id === message.author.id && i.message.id === msg.id,
                    time: 1000 * 10 * 10
                });

                collector.on('collect', async (i) => {
                    if (!i.isButton()) return;

                    if (page === 2) {
                        setTimeout(async () => {
                            client.emit('messageCreate', message);
                            msg.delete().catch(() => { });
                        }, 3000);
                    };

                    await i.deferUpdate();
                    await Guild.updateOne({ guildId: message.guild.id }, { $set: { 'savePermissions.isFirst': false } }, { upsert: true });

                    if (i.customId === 'back') {
                        back();
                    } else if (i.customId === 'no') {
                        if (page === 1) await Guild.updateOne({ guildId: message.guild.id }, { $set: { 'savePermissions.partners': false } }, { upsert: true })
                        else await Guild.updateOne({ guildId: message.guild.id }, { $set: { 'savePermissions.guildCaseHistory': false } }, { upsert: true });

                        next();
                    } else if (i.customId === 'yes') {
                        if (page === 1) await Guild.updateOne({ guildId: message.guild.id }, { $set: { 'savePermissions.partners': true } }, { upsert: true })
                        else await Guild.updateOne({ guildId: message.guild.id }, { $set: { 'savePermissions.guildCaseHistory': true } }, { upsert: true });

                        next();
                    };
                });

                collector.on('end', async () => {
                    await msg.edit({
                        components: []
                    }).catch(() => { });
                });

                return;
            };*/

            const id = nanoid(5);
            webhook.send({
                content: `\`[${id}] [${new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}] [Action Started] | ${message.author.displayName} (${message.author.username}): ${message.content} | Server: ${message.guild.name} (${message.guild.id}) | Response waiting...\``
            }).catch(() => { });
            const rt = Date.now();

            await Global.updateOne({ globalId: 'global' }, { $inc: { 'stats.commandUsage': 1 } }, { upsert: true });
            try {
                if (isAsyncFunction(file.run)) await file.run(client, msg, args, localize).catch(errorHandler);
                else await file.run(client, msg, args, localize);

                const finish = Date.now();
                await webhook.send({
                    content: `\`[${id}] [${new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}] [Action Finished] | ${message.author.displayName} (${message.author.username}): ${message.content} | Server: ${message.guild.name} (${message.guild.id}) | Response time: ${finish - rt}ms\``
                }).catch(() => { });
            } catch (err) {
                errorHandler(err);
            };
        } catch (err) {
            console.error(err);
        };
    }
};