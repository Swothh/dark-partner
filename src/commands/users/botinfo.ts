import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, version as VersionDJS } from 'discord.js';
import { Commands } from '../../structures';
import { Global } from '../../models';
import mongoose from 'mongoose';

export const Command: Commands = {
    name: 'botinfoqwe',
    description: 'Botun anlık bilgilerini görüntülersiniz.',
    aliases: ['bot-info', 'botbilgi', 'bot-bilgi', 'bb', 'istatistik', 'i'],
    category: 'users',
    cooldown: 5000,
    requireds: {
        owner: true
    },
    run: async (client, message, args, locale) => {
        const $now_cache = Date.now();
        const all_guilds = client.collectionGuilds.get('database_guild');
        const cache_ping = Date.now() - $now_cache;

        const total_guilds = await client.shardManager.eval('GET_GUILD_COUNT');
        const total_users = await client.shardManager.eval('GET_USERS_COUNT');

        const $now = Date.now();
        const db = await Global.findOne({ globalId: 'global' });
        const db_ping = Date.now() - $now;

        let is_advanced_info = false;
        let target = 500;

        const embed = new EmbedBuilder()
            .setColor(client.config.colors.main)
            .setAuthor({
                name: locale('commands.botinfo.author', {
                    client: client.user.username
                }),
                iconURL: client.user.displayAvatarURL()
            })
            .setDescription(locale('commands.botinfo.description'))
            .addFields({
                name: locale('commands.botinfo.fields_1'),
                value: (locale as any)('commands.botinfo.fields_1_value').join('\n')
                    .replace('{guilds}', total_guilds.data)
                    .replace('{users}', total_users.data)
                    .replace('{progress_bar}', total_guilds.data > target ? client.utils.ProgressBar(total_guilds.data, target + 50, 10) : client.utils.ProgressBar(total_guilds.data, target, 10))
            }, {
                name: locale('commands.botinfo.fields_2'),
                value: (locale as any)('commands.botinfo.fields_2_value').join('\n')
                    .replace('{uptime}', `<t:${Math.floor((Date.now() - client.uptime) / 1000)}:R>`)
                    .replace('{memory}', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`)
                    .replace('{memory_percent}', `${((process.memoryUsage().heapUsed / 1024 / 1024) / 1024 * 100).toFixed(2)}%`)
                    .replace('{database}', mongoose.connection.readyState === 1 ? locale('_global.connected') : locale('_global.not_connected'))
                    .replace('{cpu_percent}', `%${((process.cpuUsage().user / 1024 / 1024) / 1024 * 100).toFixed(2)}`)
            }, {
                name: locale('commands.botinfo.fields_3'),
                value: (locale as any)('commands.botinfo.fields_3_value').join('\n')
                    .replace(`{client}`, client.user.username)
                    .replace('{client_version}', client.config.main.version)
                    .replace('{nodejs}', process.version)
                    .replace('{typescript}', 'v' + require('typescript').version)
                    .replace('{db}', 'v' + mongoose.version)

            }, {
                name: locale('commands.botinfo.fields_4'),
                value: (locale as any)('commands.botinfo.fields_4_value').join('\n')
                    .replace('{cache_ping}', `${cache_ping}ms`)
                    .replace('{db_ping}', `${db_ping}ms`)
                    .replace('{api_ping}', `${client.ws.ping}ms`)
            })
            .setFooter({
                text: locale('commands.botinfo.footer'),
                iconURL: client.config.icons.info
            })
            .setTimestamp();

        const msg = await message.nmReply({
            embeds: [embed],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('botinfo_advanced')
                            .setLabel(locale('commands.botinfo.advanced_info'))
                            .setStyle(ButtonStyle.Secondary)
                    )
            ]
        });

        const collector = client.managers.Collector({
            msg,
            channel: message.channel,
            filter: i => i.user.id === message.author.id && i.message.id === msg.id,
            time: 6000 * 10 * 10
        });

        collector.on('collect', async i => {
            await i.deferUpdate();

            if (i.customId === 'botinfo_advanced') {
                if (is_advanced_info) {
                    const embed = new EmbedBuilder()
                        .setColor(client.config.colors.main)
                        .setAuthor({
                            name: locale('commands.botinfo.author_advanced', {
                                client: client.user.username
                            }),
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setDescription(locale('commands.botinfo.description'))
                        .addFields({
                            name: locale('commands.botinfo.fields_1_advanced'),
                            value: (locale as any)('commands.botinfo.fields_1_advanced_value').join('\n')
                                .replace('{partner_status_open}', all_guilds.filter(g => g?.partner?.status === 1).length)
                                .replace('{botlist_status_open}', all_guilds.filter(g => g?.botlist?.status === 1).length)
                        }, {
                            name: locale('commands.botinfo.fields_2_advanced'),
                            value: (locale as any)('commands.botinfo.fields_2_advanced_value').join('\n')
                                .replace('{total_cmd_use}', db?.stats?.commandUsage)
                                .replace('{total_partner}', all_guilds.map(g => g.partner?.total ?? 0).reduce((a, b) => a + b, 0).toLocaleString())
                                .replace('{total_botlist}', all_guilds.map(g => g.botlist?.bots?.length ?? 0).reduce((a, b) => a + b, 0).toLocaleString())
                                .replace('{total_vote}', (await client.utils.GetBot.GET_DARK_VOTE()).monthlyPoints.toLocaleString())
                        }, {
                            name: locale('commands.botinfo.fields_3_advanced'),
                            value: (locale as any)('commands.botinfo.fields_3_advanced_value').join('\n')
                                .replace('{total_error}', db?.stats?.totalError)
                                .replace('{total_reboot}', db?.stats?.totalReboot)
                                .replace('{last_reboot}', db?.stats?.lastReboot ? `<t:${Math.floor(db?.stats?.lastReboot / 1000)}:R>` : locale('commands.botinfo.fields_3_advanced_value_last_reboot_not_found'))
                                .replace('{total_crash}', db?.stats?.totalCrash)
                                .replace('{total_cmd}', client.commands.size)
                        }, {
                            name: locale('commands.botinfo.fields_4_advanced'),
                            value: (locale as any)('commands.botinfo.fields_4_advanced_value').join('\n')
                                .replace('{total_shard}', `${client.shard.count}`)
                                .replace('{guild_shard}', `${message.guild.shardId}`)
                                .replace('{shard_ping}', `${client.ws.ping}`)
                                .replace('{shard_guilds}', `${client.guilds.cache.size}`)
                        })
                        .setFooter({
                            text: locale('commands.botinfo.footer'),
                            iconURL: client.config.icons.info
                        })
                        .setTimestamp();

                    await i.message.edit({
                        embeds: [embed],
                        components: [
                            new ActionRowBuilder<ButtonBuilder>()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('botinfo_normal')
                                        .setLabel(locale('commands.botinfo.normal_info'))
                                        .setStyle(ButtonStyle.Secondary)
                                )
                        ]
                    });
                } else {
                    await i.message.edit({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.config.colors.blank)
                                .setDescription(locale('commands.botinfo.advanced_started'))
                        ],
                        components: []
                    });

                    setTimeout(async () => {
                        const embed = new EmbedBuilder()
                            .setColor(client.config.colors.main)
                            .setAuthor({
                                name: locale('commands.botinfo.author_advanced', {
                                    client: client.user.username
                                }),
                                iconURL: client.user.displayAvatarURL()
                            })
                            .setDescription(locale('commands.botinfo.description'))
                            .addFields({
                                name: locale('commands.botinfo.fields_1_advanced'),
                                value: (locale as any)('commands.botinfo.fields_1_advanced_value').join('\n')
                                    .replace('{partner_status_open}', all_guilds.filter(g => g?.partner?.status === 1).length)
                                    .replace('{botlist_status_open}', all_guilds.filter(g => g?.botlist?.status === 1).length)
                            }, {
                                name: locale('commands.botinfo.fields_2_advanced'),
                                value: (locale as any)('commands.botinfo.fields_2_advanced_value').join('\n')
                                    .replace('{total_cmd_use}', db?.stats?.commandUsage)
                                    .replace('{total_partner}', all_guilds.map(g => g.partner?.total ?? 0).reduce((a, b) => a + b, 0).toLocaleString())
                                    .replace('{total_botlist}', all_guilds.map(g => g.botlist?.bots?.length ?? 0).reduce((a, b) => a + b, 0).toLocaleString())
                                    .replace('{total_vote}', (await client.utils.GetBot.GET_DARK_VOTE()).monthlyPoints.toLocaleString())
                            }, {
                                name: locale('commands.botinfo.fields_3_advanced'),
                                value: (locale as any)('commands.botinfo.fields_3_advanced_value').join('\n')
                                    .replace('{total_error}', db?.stats?.totalError)
                                    .replace('{total_reboot}', db?.stats?.totalReboot)
                                    .replace('{last_reboot}', db?.stats?.lastReboot ? `<t:${Math.floor(db?.stats?.lastReboot / 1000)}:R>` : locale('commands.botinfo.fields_3_advanced_value_last_reboot_not_found'))
                                    .replace('{total_crash}', db?.stats?.totalCrash)
                                    .replace('{total_cmd}', client.commands.size)
                            }, {
                                name: locale('commands.botinfo.fields_4_advanced'),
                                value: (locale as any)('commands.botinfo.fields_4_advanced_value').join('\n')
                                    .replace('{total_shard}', `${client.shard.count}`)
                                    .replace('{guild_shard}', `${message.guild.shardId}`)
                                    .replace('{shard_ping}', `${client.ws.ping}`)
                                    .replace('{shard_guilds}', `${client.guilds.cache.size}`)
                            })
                            .setFooter({
                                text: locale('commands.botinfo.footer'),
                                iconURL: client.config.icons.info
                            })
                            .setTimestamp();

                        await i.message.edit({
                            embeds: [embed],
                            components: [
                                new ActionRowBuilder<ButtonBuilder>()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setCustomId('botinfo_normal')
                                            .setLabel(locale('commands.botinfo.normal_info'))
                                            .setStyle(ButtonStyle.Secondary)
                                    )
                            ]
                        });

                        is_advanced_info = true;
                    }, 2000);
                };
            } else if (i.customId === 'botinfo_normal') {
                const embed = new EmbedBuilder()
                    .setColor(client.config.colors.main)
                    .setAuthor({
                        name: locale('commands.botinfo.author', {
                            client: client.user.username
                        }),
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setDescription(locale('commands.botinfo.description'))
                    .addFields({
                        name: locale('commands.botinfo.fields_1'),
                        value: (locale as any)('commands.botinfo.fields_1_value').join('\n')
                            .replace('{guilds}', total_guilds.data)
                            .replace('{users}', total_users.data)
                            .replace('{progress_bar}', client.utils.ProgressBar(total_guilds.data, target, 10))
                    }, {
                        name: locale('commands.botinfo.fields_2'),
                        value: (locale as any)('commands.botinfo.fields_2_value').join('\n')
                            .replace('{uptime}', `<t:${Math.floor((Date.now() - client.uptime) / 1000)}:R>`)
                            .replace('{memory}', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`)
                            .replace('{memory_percent}', `${((process.memoryUsage().heapUsed / 1024 / 1024) / 1024 * 100).toFixed(2)}%`)
                            .replace('{database}', mongoose.connection.readyState === 1 ? locale('_global.connected') : locale('_global.not_connected'))
                            .replace('{cpu_percent}', `%${((process.cpuUsage().user / 1024 / 1024) / 1024 * 100).toFixed(2)}`)
                    }, {
                        name: locale('commands.botinfo.fields_3'),
                        value: (locale as any)('commands.botinfo.fields_3_value').join('\n')
                            .replace(`{client}`, client.user.username)
                            .replace('{client_version}', client.config.main.version)
                            .replace('{nodejs}', process.version)
                            .replace('{typescript}', 'v' + require('typescript').version)
                            .replace('{db}', 'v' + mongoose.version)

                    }, {
                        name: locale('commands.botinfo.fields_4'),
                        value: (locale as any)('commands.botinfo.fields_4_value').join('\n')
                            .replace('{cache_ping}', `${cache_ping}ms`)
                            .replace('{db_ping}', `${db_ping}ms`)
                            .replace('{api_ping}', `${client.ws.ping}ms`)
                    })
                    .setFooter({
                        text: locale('commands.botinfo.footer'),
                        iconURL: client.config.icons.info
                    })
                    .setTimestamp();


                await i.message.edit({
                    embeds: [embed],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('botinfo_advanced')
                                    .setLabel(locale('commands.botinfo.advanced_info'))
                                    .setStyle(ButtonStyle.Secondary)
                            )
                    ]
                });
            };
        });
    }
};