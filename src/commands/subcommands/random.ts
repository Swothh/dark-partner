import { Commands } from '../../structures';
import { Guild, Requests, Timeouts } from '../../models';
import { InferSchemaType } from 'mongoose';
import { ActionRowBuilder, ButtonStyle, EmbedBuilder, ComponentType } from 'discord.js';
import { ButtonBuilder } from 'discord.js';

export const Random: Commands['run'] = async (client, message, args, locale) => {
    // subscribe yapılacak //
    let db = await Guild.findOne({ guildId: message.guild.id });

    let requests = client.collectionGuilds.get('database_requests');
    let timeouts = client.collectionGuilds.get('database_timeouts');
    let guilds = client.collectionGuilds.get('database_guild')
        .filter(g => g.guildId !== message.guild.id)
        .filter(g => g.partner?.status === 1)
        .filter(g => message.guild.memberCount >= (g.partner?.must?.member ?? 0))
        .filter(g => !g.partner?.blacklists?.categories?.includes(db?.partner?.category ?? '??'))
        .filter(g => !g.partner?.blacklists?.guilds?.includes(message.guild.id))
        .filter(g => db?.partner?.blacklists?.guilds?.includes(g.guildId) !== true)
        .filter(g => db?.partner?.blacklists?.categories?.includes(g.partner?.category ?? '??') !== true)
        .filter(g => typeof g.partner?.text !== undefined)
        .filter(g => typeof g.partner?.category !== undefined)
        .filter(g => typeof g.partner?.channel !== undefined)
        .filter(g => typeof g.partner?.log !== undefined)
        .filter(g => typeof g.partner?.staff !== undefined)
        .filter(g => !requests.find(r => (r.guild === message.guild.id && r.target === g.guildId) || (r.target === message.guild.id && r.guild === g.guildId)))
        .filter(g => !timeouts.find(t => (t.guild === message.guild.id && t.target === g.guildId) || (t.target === message.guild.id && t.guild === g.guildId)))
        .filter(async g => !(await client.shardManager.eval('GET_GUILD', { guild: g.guildId })));
    /*.filter(async (g: InferSchemaType<typeof Guild['schema']>) => {
        return g.guildId !== message.guild.id &&
            g.partner?.status === 1 &&
            message.guild.memberCount >= (g.partner?.must?.member ?? 0) &&
            !g.partner?.blacklists?.categories?.includes(db?.partner?.category ?? '??') &&
            !g.partner?.blacklists?.guilds?.includes(message.guild.id) &&
            typeof g.partner?.text !== undefined &&
            typeof g.partner?.category !== undefined &&
            typeof g.partner?.channel !== undefined &&
            typeof g.partner?.log !== undefined &&
            typeof g.partner?.staff !== undefined &&
            !requests.find((r: InferSchemaType<typeof Requests['schema']>) => (r.guild === message.guild.id && r.target === g.guildId) || (r.target === message.guild.id && r.guild === g.guildId)) &&
            !timeouts.find((t: InferSchemaType<typeof Timeouts['schema']>) => (t.guild === message.guild.id && t.target === g.guildId) || (t.target === message.guild.id && t.guild === g.guildId)) &&
            !(await client.shardManager.eval('GET_GUILD', { guild: g.guildId }))
    });*/

    let before_random: string[] = [];
    let total_err = 0;
    let is_sending_err_message = false;
    if (guilds.length < 0) return message.error(locale('commands.partner.random.not_found'));

    const get = async (): Promise<any> => {
        db = await Guild.findOne({ guildId: message.guild.id });
        if ((db?.subscriptions?.partner_random ?? 0) < 1) return;

        const array = guilds.filter((g: InferSchemaType<typeof Guild['schema']>) => !before_random.includes(g.guildId));
        if (array.length < 1) return;

        let random = array[Math.floor(Math.random() * array.length)] as InferSchemaType<typeof Guild['schema']>;
        before_random.push(random.guildId);

        const guild = await client.shardManager.getGuild(random.guildId);

        if (!guild) {
            total_err++;
            if (total_err >= 3 && !is_sending_err_message) {
                is_sending_err_message = true;
                message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Blue')
                            .setDescription(locale('commands.partner.random.long_time'))
                            .setAuthor({
                                name: `${locale('_global.error')} — ${message.author.displayName ?? message.author.username}`,
                                iconURL: message.author.displayAvatarURL()
                            }),
                    ]
                });
            };
            return get();
        };

        const [size, members] = await Promise.all([
            client.shardManager.shardEval(guild.shardId, 'GET_CHANNEL_MEMBERS', { guild: guild?.id, channel: random.partner?.channel ?? '' }),
            client.shardManager.shardEval(guild.shardId, 'GET_PRESENCES', { guild: guild?.id })
        ]);

        await Guild.updateOne({ guildId: message.guild.id }, {
            $inc: {
                'subscriptions.partner_random': -1
            }
        }, { upsert: true });

        return {
            db: random,
            guild: guild,
            owner: guild.ownerId,
            members,
            size
        };
    };

    let data = await get();
    const get_embed = () => {
        if (!data) {
            // subscribe yapılacak
            if ((db?.subscriptions?.partner_random ?? 0) < 1) {
                return new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(locale('commands.partner.random.no_subscribe'))
                    .setAuthor({
                        name: `${locale('_global.error')} — ${message.author.displayName ?? message.author.username}`,
                        iconURL: message.author.displayAvatarURL()
                    })
                    .setFooter({
                        text: locale('_global.error_occured'),
                        iconURL: message.author.displayAvatarURL()
                    })
                    .setTimestamp();
            } else if (guilds.filter((g: InferSchemaType<typeof Guild['schema']>) => !before_random.includes(g.guildId)).length < 1) {
                return new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(locale('commands.partner.random.not_found'))
                    .setAuthor({
                        name: `${locale('_global.error')} — ${message.author.displayName ?? message.author.username}`,
                        iconURL: message.author.displayAvatarURL()
                    })
                    .setFooter({
                        text: locale('_global.error_occured'),
                        iconURL: message.author.displayAvatarURL()
                    })
                    .setTimestamp();
            } else {
                return new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(locale('commands.partner.random.unknown_error'))
                    .setAuthor({
                        name: `${locale('_global.error')} — ${message.author.displayName ?? message.author.username}`,
                        iconURL: message.author.displayAvatarURL()
                    })
                    .setFooter({
                        text: locale('_global.error_occured'),
                        iconURL: message.author.displayAvatarURL()
                    })
                    .setTimestamp();
            };
        };

        const embed = new EmbedBuilder()
            .setColor(client.config.colors.main)
            .setDescription(locale('commands.partner.random.embed.description', {
                total: guilds.length.toString(),
            }))
            .addFields({
                name: `${client.config.emojis.partner.server_name} ${locale('commands.partner.random.embed.fields_1')}`,
                value: `**╰** ${data.guild?.name}`,
                inline: true
            }, {
                name: `${client.config.emojis.partner.server_owner} ${locale('commands.partner.random.embed.fields_2')}`,
                //value: `**╰** ${data.owner?.id ? `${data.owner?.name} *(${data.owner?.username})*` : (data.owner?.username ?? '??')}`,
                value: '**╰** ERROR',
                inline: true
            }, {
                name: `${client.config.emojis.partner.partner_category} ${locale('commands.partner.random.embed.fields_3')}`,
                value: `**╰** ${client.config.categories(locale).find(x => x.value === data.db.partner?.category ?? '??')?.label ?? '??'}`,
                inline: true
            }, {
                name: `${client.config.emojis.partner.total_partner} ${locale('commands.partner.random.embed.fields_4')}`,
                value: `**╰** ${data.db.partner?.total ?? 0}`,
                inline: true
            }, {
                name: `${client.config.emojis.partner.channel_members} ${locale('commands.partner.random.embed.fields_5')}`,
                value: `**╰** ${data.size ?? 0}`,
                inline: true
            }, {
                name: `${client.config.emojis.partner.links} ${locale('commands.partner.random.embed.fields_6')}`,
                value: `**╰** ${data.db.partner?.text?.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g)?.length ?? 0}`,
                inline: true
            }, {
                name: `${client.config.emojis.partner.code} ${locale('commands.partner.random.embed.fields_7')}`,
                value: `**╰** ${data.db.partner?.specialUrl ? data.db.partner?.specialUrl : data.db.partner?.url}`
            }, {
                name: `${client.config.emojis.partner.members_advanced} ${locale('commands.partner.random.embed.fields_8')}`,
                value: [
                    '**╰**',
                    `${client.config.emojis.partner.total_members} ${data.guild?.memberCount}`,
                    `${client.config.emojis.partner.online} ${data.members.online}`,
                    `${client.config.emojis.partner.idle} ${data.members.idle}`,
                    `${client.config.emojis.partner.dnd} ${data.members.dnd}`,
                    `${client.config.emojis.partner.offline} ${data.members.offline}`,
                    `${client.config.emojis.partner.bot} ${data.members.bot}`
                ].join(' ')
            })
            .setAuthor({
                name: locale('commands.partner.random.embed.author', {
                    guild: data.guild.name
                }),
                iconURL: !data.guild.icon ? 'https://images-eds-ssl.xboxlive.com/image?url=Q_rwcVSTCIytJ0KOzcjWTYl.n38D8jlKWXJx7NRJmQKBAEDCgtTAQ0JS02UoaiwRCHTTX1RAopljdoYpOaNfVf5nBNvbwGfyR5n4DAs0DsOwxSO9puiT_GgKqinHT8HsW8VYeiiuU1IG3jY69EhnsQ--&format=source' : `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}`
            })
            .setFooter({
                text: locale('commands.partner.random.embed.footer', {
                    sub: (db?.subscriptions?.partner_random ?? 0).toLocaleString()
                }),
                iconURL: client.config.icons.info
            })
            .setTimestamp();

        return embed;
    };

    const get_components = (l?: boolean) => new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('random.send')
                .setLabel(locale('commands.partner.random.buttons_send'))
                .setEmoji(client.config.emojis.random_send)
                .setStyle(ButtonStyle.Primary)
                .setDisabled(l ?? false),
            new ButtonBuilder()
                .setCustomId('random.refresh')
                .setLabel(locale('commands.partner.random.buttons_refresh'))
                .setEmoji(client.config.emojis.random_refresh)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(l ?? false),
        );

    const msg = await message.channel.send({
        embeds: [get_embed()],
        components: [get_components()]
    });

    const collector = client.managers.Collector({
        msg,
        channel: message.channel,
        componentType: ComponentType.Button,
        time: 300000,
        filter: i => i.user.id === message.author.id && i.message.id === msg.id,
    });

    collector.on('collect', async (i) => {
        if (i.customId === 'random.refresh') {
            await i.deferUpdate();
            data = await get();

            await msg.edit({
                embeds: [get_embed()],
                components: [get_components()]
            });
        } else if (i.customId === 'random.send') {
            if (!data?.guild) return;

            client.utils.Partner.SEND_PARTNER_REQUEST(client, {
                this: {
                    guild: message.guild,
                    guild_db: db
                },
                target: {
                    guild: data.guild,
                    guild_db: data.db
                },
                locale,
                message
            }).then(async d => {
                await i.deferUpdate();
                if (!d.ok) return message.error(d.message);

                client.collectionGuilds.get('database_requests').push({
                    guild: message.guild.id,
                    target: data.guild.id,
                    message: d.message_id,
                    author: message.author.id,
                    date: Date.now()
                });

                requests = client.collectionGuilds.get('database_requests');
                await msg.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Green')
                            .setDescription(d.message)
                            .setAuthor({
                                name: locale('commands.partner.random.embed.author', {
                                    guild: data.guild?.name
                                }),
                                iconURL: `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}`
                            })
                            .setFooter({
                                text: locale('commands.partner.random.embed.footer', {
                                    sub: (db?.subscriptions?.partner_random ?? 0).toLocaleString()
                                }),
                                iconURL: client.config.icons.info
                            })
                    ]
                });

            });
        };
    });
};