import Dark from '../client';
import { Guild, Requests, Timeouts } from '../models';
import { Guild as DiscordGuild, GuildMember, EmbedBuilder, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ButtonInteraction } from 'discord.js';
import { InferSchemaType } from 'mongoose';
import { Localizer } from '../managers';
import * as language from '../languages/tr';
import * as config from '../configs';

interface RequestOptions {
    this: {
        guild: DiscordGuild;
        guild_db: InferSchemaType<typeof Guild['schema']>;
    },
    target: {
        guild: DiscordGuild;
        guild_db: InferSchemaType<typeof Guild['schema']>;
    },
    locale: ReturnType<typeof Localizer>;
    message: Message;
};

interface SendLogRequest {
    this: {
        guild: DiscordGuild;
        guild_db: InferSchemaType<typeof Guild['schema']>;
    },
    target: {
        guild: DiscordGuild;
        guild_db: InferSchemaType<typeof Guild['schema']>;
    },
    request: InferSchemaType<typeof Requests['schema']>;
};

export class Partner {
    public static async SEND_PARTNER_REQUEST(client: Dark, options: RequestOptions) {
        const target_guild_locale = client.locales.get(options.target.guild_db?.locale ?? 'tr');

        if (options.this.guild.memberCount < (options.target.guild_db.partner?.must?.member ?? 0)) return {
            ok: false,
            message: options.locale('commands.partner.send.must_error', {
                member_count: String(options.target.guild_db.partner?.must?.member)
            }),
            message_id: null
        };

        const owner = await options.this.guild.fetchOwner().catch(() => null) as GuildMember;
        if (!owner) return {
            ok: false,
            message: options.locale('commands.partner.send.fetch_owner_error'),
            message_id: null
        };

        const requests = (client.collectionGuilds.get('database_requests') ?? []);
        const find = requests.find((r: InferSchemaType<typeof Requests['schema']>) => r.guild === options.this.guild.id && r.target === options.target.guild.id);

        if (find) return {
            ok: false,
            message: options.locale('commands.partner.send.already_request_error'),
            message_id: null
        };

        const timeout = (client.collectionGuilds.get('database_timeouts') ?? []);
        const find_timeout = timeout.find((t: InferSchemaType<typeof Timeouts['schema']>) => t.guild === options.this.guild.id && t.target === options.target.guild.id);
        const past = Date.now() - (find_timeout?.date ?? 0);
        const remaining = new Date(Date.now() + 1000 * 60 * 60 * 12 - past);

        if (find_timeout && past < 1000 * 60 * 60 * 12) return {
            ok: false,
            message: options.locale('commands.partner.send.timeout_error', {
                time: Math.floor(remaining.getTime() / 1000) as any
            }),
            message_id: null
        };

        const guild_channel = await client.shardManager.shardEval(options.this.guild.shardId, 'GET_CHANNEL', { guild: options.this.guild.id, channel: options.this.guild_db.partner?.channel ?? '' });
        if (!guild_channel || !guild_channel?.[0] || guild_channel?.[0]?.type !== ChannelType.GuildText) return {
            ok: false,
            message: options.locale('commands.partner.send.guild_channel_error')
        };

        const target_guild_channel = await client.shardManager.shardEval(options.target.guild.shardId, 'GET_CHANNEL', { guild: options.target.guild.id, channel: options.target.guild_db.partner?.channel ?? '' });
        if (!target_guild_channel || !target_guild_channel?.[0] || target_guild_channel?.[0]?.type !== ChannelType.GuildText) return {
            ok: false,
            message: options.locale('commands.partner.send.guild_channel_error'),
            message_id: null
        };

        const channel_size = await client.shardManager.shardEval(options.this.guild.shardId, 'GET_CHANNEL_MEMBERS', { guild: options.this.guild.id, channel: options.this.guild_db.partner?.channel ?? '' });
        const embed = new EmbedBuilder()
            .setColor('White')
            .setAuthor({
                name: target_guild_locale.__.commands.partner.send.embed.author.replace('{guild_name}', options.this.guild.name),
                iconURL: options.message.author.displayAvatarURL()
            })
            .setDescription(target_guild_locale.__.commands.partner.send.embed.description)
            .addFields({
                name: `${config.default.emojis.partner.server_owner} ${target_guild_locale.__.commands.partner.send.embed.fields_1_name}`,
                value: `**╰** ${owner.user.displayName ? `${owner.user.displayName} *(${owner.user.username})*` : owner.user.username}`,
                inline: true
            }, {
                name: `${config.default.emojis.partner.total_members} ${target_guild_locale.__.commands.partner.send.embed.fields_2_name}`,
                value: `**╰** ${options.this.guild.memberCount}`,
                inline: true
            }, {
                name: `${config.default.emojis.partner.partner_category} ${target_guild_locale.__.commands.partner.send.embed.fields_3_name}`,
                value: `**╰** ${config.default.categories(options.locale).find(x => x.value === options.this.guild_db.partner?.category ?? '??')?.label ?? '??'}`,
                inline: true
            }, {
                name: `${config.default.emojis.partner.total_partner} ${target_guild_locale.__.commands.partner.send.embed.fields_4_name}`,
                value: `**╰** ${options.this.guild_db.partner?.total ?? 0}`,
                inline: true
            }, {
                name: `${config.default.emojis.partner.links} ${target_guild_locale.__.commands.partner.send.embed.fields_5_name}`,
                value: `**╰** ${options.this.guild_db.partner?.text?.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g)?.length ?? 0}`,
                inline: true
            }, {
                name: `${config.default.emojis.partner.channel_members} ${target_guild_locale.__.commands.partner.send.embed.fields_6_name}`,
                value: `**╰** ${channel_size ?? 0}`,
                inline: true
            }, {
                name: `${config.default.emojis.partner.members_advanced} ${target_guild_locale.__.commands.partner.send.embed.fields_7_name}`,
                value: [
                    '**╰**',
                    `${config.default.emojis.partner.online} ${options.this.guild.members.cache.filter(x => x.presence?.status === 'online').size}`,
                    `${config.default.emojis.partner.idle} ${options.this.guild.members.cache.filter(x => x.presence?.status === 'idle').size}`,
                    `${config.default.emojis.partner.dnd} ${options.this.guild.members.cache.filter(x => x.presence?.status === 'dnd').size}`,
                    `${config.default.emojis.partner.offline} ${options.this.guild.members.cache.filter(x => x.presence?.status === 'offline').size}`,
                    `${config.default.emojis.partner.bot} ${options.this.guild.members.cache.filter(x => x.user.bot).size}`
                ].join(' ')
            })
            .setImage(options.this.guild.bannerURL({ size: 4096 }) ? options.this.guild.bannerURL({ size: 4096 })! : null)
            .setTimestamp()
            .setFooter({
                text: 'rID: c0f663b6-e30a-49fd-bdae-7492817aff21',
                iconURL: config.default.icons.info_2
            });

        const buttons = [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('partner.approve')
                        .setLabel(target_guild_locale.__.commands.partner.send.buttons_approve)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(config.default.emojis.partner.buttons_approved),
                    new ButtonBuilder()
                        .setCustomId('partner.deny')
                        .setLabel(target_guild_locale.__.commands.partner.send.buttons_deny)
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji(config.default.emojis.partner.buttons_denied),
                    new ButtonBuilder()
                        .setCustomId('partner.blacklist')
                        .setLabel(target_guild_locale.__.commands.partner.send.buttons_blacklist)
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(config.default.emojis.partner.buttons_blacklist)
                ),
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('partner.view_text')
                        .setLabel(target_guild_locale.__.commands.partner.send.buttons_info)
                        .setStyle(ButtonStyle.Success)
                        .setEmoji(config.default.emojis.partner.buttons_info),
                )
        ];

        const message = await client.shardManager.sendMessage(options.target.guild.id, options.target.guild_db.partner?.log ?? '', {
            content: `<@&${options.target.guild_db.partner?.staff ?? ''}>`,
            embeds: [embed],
            components: buttons
        });

        if (!message) return {
            ok: false,
            message: options.locale('commands.partner.send.unknown_error'),
            message_id: null
        };

        await Requests.updateOne({
            guild: options.this.guild.id,
            target: options.target.guild.id
        }, {
            $set: {
                guild: options.this.guild.id,
                target: options.target.guild.id,
                message: message.id,
                author: options.message.author.id,
                date: Date.now()
            }
        }, {
            upsert: true
        });

        await Timeouts.updateOne({
            guild: options.this.guild.id,
            target: options.target.guild.id
        }, {
            $set: {
                guild: options.this.guild.id,
                target: options.target.guild.id,
                date: Date.now()
            }
        }, {
            upsert: true
        });

        return {
            ok: true,
            message: options.locale('commands.partner.send.success', {
                guild: options.target.guild.name
            }),
            message_id: message.id
        };
    };

    public static async SEND_LOG(client: Dark, locale: typeof language.__, i: ButtonInteraction, options: SendLogRequest, is_accept: boolean, reason?: string) {
        const get_user = await client.shardManager.eval('GET_USER', {
            user: options.request.author
        });

        const embed = new EmbedBuilder()
            .setColor(client.config.colors.main)
            .setAuthor({
                name: is_accept ? locale.events.partner.logs.accept_author : locale.events.partner.logs.deny_author,
                iconURL: `https://cdn.discordapp.com/icons/${options.this.guild.id}/${options.this.guild.icon}.png?size=4096`
            })
            .setDescription(
                is_accept ? locale.events.partner.logs.accept_description.replace(
                    '{guild}',
                    options.this.guild.name
                ) : locale.events.partner.logs.deny_description.replace(
                    '{guild}',
                    options.this.guild.name
                )
            )
            .addFields({
                name: locale.events.partner.logs.embed_fields_1_name,
                value: [
                    `**╰** ${get_user?.data?.globalName ?? '??'}`,
                ].join('\n'),
                inline: true
            }, is_accept ? {
                name: locale.events.partner.logs.accept_fields_2_name,
                value: [
                    `**╰** ${i.user.displayName} *(${i.user.username})*`,
                ].join('\n'),
                inline: true
            } : {
                name: locale.events.partner.logs.deny_fields_2_name,
                value: [
                    `**╰** ${i.user.displayName} *(${i.user.username})*`,
                ].join('\n'),
                inline: true
            }, {
                name: locale.events.partner.logs.embed_fields_3_name,
                value: [
                    `**╰** ${options.target.guild_db.partner.total ?? 0 + 1}`,
                ].join('\n'),
                inline: true
            }, ...(!is_accept ? [{
                name: locale.events.partner.logs.deny_fields_4_name,
                value: [
                    '```',
                    reason,
                    '```'
                ].join('\n'),
            }] : []));

        const components = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(is_accept ? ButtonStyle.Success : ButtonStyle.Danger)
                    .setCustomId(`partner.rating-${options.target.guild.id}`)
                    .setLabel(locale.events.partner.logs.buttons_rating)
                    .setEmoji(client.config.emojis.star),
            )

        return await client.shardManager.sendMessage(options.target.guild.id, options.target.guild_db.partner.log, {
            embeds: [embed],
            components: [components]
        });
    };
}; 