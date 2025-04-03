import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, version as VersionDJS, StringSelectMenuBuilder } from 'discord.js';
import TypeScript from 'typescript';
import { Commands } from '../../structures';
import { Global } from '../../models';
import mongoose from 'mongoose';

export const Command: Commands = {
    name: 'botinfo',
    description: 'Botun anlık bilgilerini görüntülersiniz.',
    aliases: ['bot-info', 'botbilgi', 'bot-bilgi', 'bb', 'istatistik', 'i'],
    category: 'users',
    cooldown: 5000,
    run: async (client, message, args, locale) => {
        const $now_cache = Date.now();
        const all_guilds = client.collectionGuilds.get('database_guild');
        const cache_ping = Date.now() - $now_cache;

        const total_guilds = await client.shardManager.getGuildCount();
        const total_users = await client.shardManager.getUsersCount();
        const total_channels = await client.shardManager.getChannelCount();
        const total_emojis = await client.shardManager.getEmojiCount();

        const $now = Date.now();
        const db = await Global.findOne({ globalId: 'global' });
        const db_ping = Date.now() - $now;

        let is_advanced_info = false;
        let target = 1000;

        const embed = new EmbedBuilder()
            .setColor(client.config.colors.main)
            .setDescription(locale('commands.botinfo.description'))
            .setAuthor({ name: locale('commands.botinfo.author', { client: client.user.username }), iconURL: message.author.avatarURL() })
            .setTitle(locale('commands.botinfo.title', { client: client.user.username }))
            .addFields((locale as any)('commands.botinfo.fields').map((field: any) => ({
                name: field.name,
                value: field.value
                    .replace('{progress_bar}', client.utils.ProgressBar(total_guilds, target, 9, false, false))
                    .replace('{guilds}', total_guilds.toLocaleString())
                    .replace('{users}', total_users.toLocaleString())
                    .replace('{channels}', total_channels.toLocaleString())
                    .replace('{emojis}', total_emojis.toLocaleString())
                    .replace('{uptime}', `<t:${Math.floor((Date.now() - client.uptime) / 1000)}:R>`)
                    .replace('{memory}', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`)
                    .replace('{memory_percent}', `${((process.memoryUsage().heapUsed / 1024 / 1024) / 1024 * 100).toFixed(2)}%`)
                    .replace('{db_status}', mongoose.connection.readyState === 1 ? locale('_global.connected') : locale('_global.not_connected'))
                    .replace('{cpu_percent}', `%${((process.cpuUsage().user / 1024 / 1024) / 1024 * 100).toFixed(2)}`)
                    .replace('{api_ping}', client.ws.ping)
                    .replace('{db_ping}', db_ping)
                    .replace('{typescript}', TypeScript.version.replace('v', ''))
                    .replace('{discordjs}', VersionDJS.replace('v', ''))
                    .replace('{nodejs}', process.version.replace('v', ''))
            })));

        const msg = await message.channel.send({
            embeds: [embed],
            components: [
                new ActionRowBuilder<StringSelectMenuBuilder>()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('botinfo_select_menu')
                            .setPlaceholder(locale('commands.botinfo.select_menu.placeholder'))
                            .addOptions([
                                {
                                    label: locale('commands.botinfo.select_menu.options.general'),
                                    value: 'general',
                                    description: locale('commands.botinfo.select_menu.options.general_description'),
                                    emoji: '📊',
                                    default: true
                                },
                                {
                                    label: locale('commands.botinfo.select_menu.options.advanced'),
                                    value: 'advanced',
                                    description: locale('commands.botinfo.select_menu.options.advanced_description'),
                                    emoji: '📈'
                                }
                            ])
                    )
            ]
        });

        const collector = client.managers.Collector({
            msg,
            channel: message.channel,
            filter: i => i.user.id === message.author.id && i.message.id === msg.id,
            time: 6000 * 10 * 10
        });

        collector.on('collect', async (i) => {
            if (!i.isStringSelectMenu()) return;
            const value = i.values[0];

            if (value === 'advanced') {
                await i.deferUpdate().catch(() => { });

                if (is_advanced_info) {
                    console.log('çalıştı')

                    const embed_advanced = new EmbedBuilder()
                        .setColor(client.config.colors.main)
                        .setDescription(locale('commands.botinfo.description'))
                        .setAuthor({ name: locale('commands.botinfo.author', { client: client.user.username }), iconURL: message.author.avatarURL() })
                        .setTitle(locale('commands.botinfo.title', { client: client.user.username }))
                        .addFields((locale as any)('commands.botinfo.advanced_fields').map((field: any) => ({
                            name: field.name,
                            value: field.value
                                .replace('{partner_status_open}', all_guilds.filter(g => g?.partner?.status === 1).length.toLocaleString())
                                .replace('{botlist_status_open}', all_guilds.filter(g => g?.botlist?.status === 1).length.toLocaleString())
                                .replace('{total_cmd_use}', db?.stats?.commandUsage?.toLocaleString())
                                .replace('{total_partner}', all_guilds.map(g => g.partner?.total ?? 0).reduce((a, b) => a + b, 0).toLocaleString())
                                .replace('{total_botlist}', all_guilds.map(g => g.botlist?.bots?.length ?? 0).reduce((a, b) => a + b, 0).toLocaleString())
                                //.replace('{total_vote}', (await client.utils.GetBot.GET_DARK_VOTE()).monthlyPoints.toLocaleString())
                                .replace('{total_reboot}', db?.stats?.totalReboot?.toLocaleString())
                                .replace('{total_error}', db?.stats?.totalError?.toLocaleString())
                                .replace('{total_crash}', db?.stats?.totalCrash?.toLocaleString())
                                .replace('{last_reboot}', db?.stats?.lastReboot ? `<t:${Math.floor(db?.stats?.lastReboot / 1000)}:R>` : locale('commands.botinfo.fields_3_advanced_value_last_reboot_not_found'))
                                .replace('{total_cmd}', client.commands.size.toLocaleString())
                                .replace('{total_shard}', client.shard.count.toLocaleString())
                                .replace('{guild_shard}', message.guild.shardId)
                                .replace('{shard_ping}', client.ws.ping)
                                .replace('{shard_guilds}', client.guilds.cache.size)
                        })));

                    await msg.edit({
                        embeds: [embed_advanced],
                        components: [
                            new ActionRowBuilder<StringSelectMenuBuilder>()
                                .addComponents(
                                    new StringSelectMenuBuilder()
                                        .setCustomId('botinfo_select_menu')
                                        .setPlaceholder(locale('commands.botinfo.select_menu.placeholder'))
                                        .addOptions([
                                            {
                                                label: locale('commands.botinfo.select_menu.options.general'),
                                                value: 'general',
                                                description: locale('commands.botinfo.select_menu.options.general_description'),
                                                emoji: '📊'
                                            },
                                            {
                                                label: locale('commands.botinfo.select_menu.options.advanced'),
                                                value: 'advanced',
                                                description: locale('commands.botinfo.select_menu.options.advanced_description'),
                                                emoji: '📈',
                                                default: true
                                            }
                                        ])
                                )
                        ]
                    });
                } else {
                    await msg.edit({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.config.colors.blank)
                                .setDescription(locale('commands.botinfo.advanced_started'))
                        ],
                        components: []
                    });

                    setTimeout(async () => {
                        const embed_advanced = new EmbedBuilder()
                            .setColor(client.config.colors.main)
                            .setDescription(locale('commands.botinfo.description'))
                            .setAuthor({ name: locale('commands.botinfo.author', { client: client.user.username }), iconURL: message.author.avatarURL() })
                            .setTitle(locale('commands.botinfo.title', { client: client.user.username }))
                            .addFields((locale as any)('commands.botinfo.advanced_fields').map((field: any) => ({
                                name: field.name,
                                value: field.value
                                    .replace('{partner_status_open}', all_guilds.filter(g => g?.partner?.status === 1).length.toLocaleString())
                                    .replace('{botlist_status_open}', all_guilds.filter(g => g?.botlist?.status === 1).length.toLocaleString())
                                    .replace('{total_cmd_use}', db?.stats?.commandUsage?.toLocaleString())
                                    .replace('{total_partner}', all_guilds.map(g => g.partner?.total ?? 0).reduce((a, b) => a + b, 0).toLocaleString())
                                    .replace('{total_botlist}', all_guilds.map(g => g.botlist?.bots?.length ?? 0).reduce((a, b) => a + b, 0).toLocaleString())
                                    //.replace('{total_vote}', (await client.utils.GetBot.GET_DARK_VOTE()).monthlyPoints.toLocaleString())
                                    .replace('{total_reboot}', db?.stats?.totalReboot?.toLocaleString())
                                    .replace('{total_error}', db?.stats?.totalError?.toLocaleString())
                                    .replace('{total_crash}', db?.stats?.totalCrash?.toLocaleString())
                                    .replace('{last_reboot}', db?.stats?.lastReboot ? `<t:${Math.floor(db?.stats?.lastReboot / 1000)}:R>` : locale('commands.botinfo.fields_3_advanced_value_last_reboot_not_found'))
                                    .replace('{total_cmd}', client.commands.size.toLocaleString())
                                    .replace('{total_shard}', client.shard.count.toLocaleString())
                                    .replace('{guild_shard}', message.guild.shardId)
                                    .replace('{shard_ping}', client.ws.ping)
                                    .replace('{shard_guilds}', client.guilds.cache.size)
                            })));

                        await msg.edit({
                            embeds: [embed_advanced],
                            components: [
                                new ActionRowBuilder<StringSelectMenuBuilder>()
                                    .addComponents(
                                        new StringSelectMenuBuilder()
                                            .setCustomId('botinfo_select_menu')
                                            .setPlaceholder(locale('commands.botinfo.select_menu.placeholder'))
                                            .addOptions([
                                                {
                                                    label: locale('commands.botinfo.select_menu.options.general'),
                                                    value: 'general',
                                                    description: locale('commands.botinfo.select_menu.options.general_description'),
                                                    emoji: '📊'
                                                },
                                                {
                                                    label: locale('commands.botinfo.select_menu.options.advanced'),
                                                    value: 'advanced',
                                                    description: locale('commands.botinfo.select_menu.options.advanced_description'),
                                                    emoji: '📈',
                                                    default: true
                                                }
                                            ])
                                    )
                            ]
                        });
                    }, 2000);
                };
            } else if (value === 'general') {
                await i.deferUpdate().catch(() => { });

                await msg.edit({
                    embeds: [embed],
                    components: [
                        new ActionRowBuilder<StringSelectMenuBuilder>()
                            .addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId('botinfo_select_menu')
                                    .setPlaceholder(locale('commands.botinfo.select_menu.placeholder'))
                                    .addOptions([
                                        {
                                            label: locale('commands.botinfo.select_menu.options.general'),
                                            value: 'general',
                                            description: locale('commands.botinfo.select_menu.options.general_description'),
                                            emoji: '📊',
                                            default: true
                                        },
                                        {
                                            label: locale('commands.botinfo.select_menu.options.advanced'),
                                            value: 'advanced',
                                            description: locale('commands.botinfo.select_menu.options.advanced_description'),
                                            emoji: '📈'
                                        }
                                    ])
                            )
                    ]
                });

                is_advanced_info = false;
            };
        });
    }
};