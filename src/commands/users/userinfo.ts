import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { Commands } from '../../structures';
import { User } from '../../models';

export const Command: Commands = {
    name: 'userinfo',
    description: 'commands.userinfo',
    aliases: ['user-info', 'userbilgi', 'user-bilgi', 'kullanıcıbilgi', 'kullanıcı-bilgi', 'kullanıcıbilgisi', 'kullanıcı-bilgisi', 'kb'],
    category: 'users',
    cooldown: 5000,
    run: async (client, message, args, locale) => {
        const user = message.mentions.users.first() || message.author;
        const member = message.guild.members.cache.get(user.id);

        const user_db = await User.findOne({ user: user.id }, { banned: true, amount: true, darkium: true, badges: true, createdAt: true });
        const used_at_to_time = new Date(user_db?.createdAt).getTime();

        const platforms: any = [];
        if (member.presence?.clientStatus?.mobile) {
            platforms.push(locale('commands.userinfo.platform.mobile'));
        };
        if (member.presence?.clientStatus?.desktop) {
            platforms.push(locale('commands.userinfo.platform.desktop'));
        };
        if (member.presence?.clientStatus?.web) {
            platforms.push(locale('commands.userinfo.platform.web'));
        };
        if (!platforms.length) {
            platforms.push(locale('commands.userinfo.platform.unknown'));
        };

        const badge_types = ['special', 'epic', 'rare', 'ordinary'];
        let featured_badge: any;

        for (const type of badge_types) {
            const badge = user_db?.badges?.map(badgeId => client.config.badges.find(b => b.id === badgeId)).find(b => b?.type === type);

            if (badge) {
                featured_badge = badge;
                break;
            };
        };

        if (user.bot) return await message.error(locale('commands.userinfo.errors.user_is_bot'));
        if (user_db?.banned?.ban) return await message.error(locale('commands.userinfo.errors.user_has_banned'));

        const msg = await message.nmReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.colors.main)
                    .setAuthor({ name: `${locale('commands.userinfo.author')} ${user.displayName}`, iconURL: message.author.displayAvatarURL() })
                    .setFooter({ text: locale('commands.userinfo.footer'), iconURL: client.config.icons.info })
                    .setTimestamp()
                    .addFields(
                        (locale as any)('commands.userinfo.fields')
                            .map((field: any) => ({
                                name: field.name,
                                value: field.value.join('\n')
                                    .replace('{displayName}', user.displayName)
                                    .replace('{username}', user.username)
                                    .replace('{id}', user.id)
                                    .replace('{created}', `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`)
                                    .replace('{joined}', `<t:${Math.floor(message.guild.members.cache.get(user.id).joinedTimestamp / 1000)}:R>`)
                                    .replace('{coin}', user_db?.amount?.toLocaleString() || 0)
                                    .replace('{darkium}', user_db?.darkium?.toLocaleString() || 0)
                                    .replace('{total_badge}', user_db?.badges?.length || 0)
                                    .replace('{dp_used}', `<t:${Math.floor(used_at_to_time / 1000)}:R>`)
                                    .replace('{platform}', platforms.join(', '))
                                    .replace('{status}', member.presence?.status === 'online' ? locale('commands.userinfo.status.online') : member.presence?.status === 'idle' ? locale('commands.userinfo.status.idle') : member.presence?.status === 'dnd' ? locale('commands.userinfo.status.dnd') : locale('commands.userinfo.status.offline'))
                                    .replace('{user_activity}', member.presence?.activities[0]?.name ? locale('commands.userinfo.activity.yes') : locale('commands.userinfo.activity.unknown'))
                                    .replace('{featured_badge}', !featured_badge ? locale('commands.userinfo.no_badge_found') : `${featured_badge?.emojis?.big[0][0]}${featured_badge?.emojis?.big[0][1]} **${locale(featured_badge?.name)}** \n${featured_badge?.emojis?.big[1][0]}${featured_badge?.emojis?.big[1][1]} *${locale(featured_badge.description)}*`),
                                inline: field.inline
                            }))
                    )
            ],
            components: [
                new ActionRowBuilder<StringSelectMenuBuilder>()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('user_info_select_menu')
                            .setPlaceholder(locale('commands.userinfo.select_menu_placeholder'))
                            .addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setDefault(true)
                                    .setLabel(locale('commands.userinfo.select_menu_1'))
                                    .setValue('back')
                                    .setDescription(locale('commands.userinfo.select_menu_1_description'))
                                    .setEmoji(client.config.emojis.back),
                                new StringSelectMenuOptionBuilder()
                                    .setLabel(locale('commands.userinfo.select_menu_2'))
                                    .setValue('badges')
                                    .setDescription(locale('commands.userinfo.select_menu_2_description'))
                                    .setEmoji(client.config.emojis.total),
                            )
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

            if (i.customId === 'user_info_select_menu') {
                const value = i.values[0];

                if (value === 'badges') {
                    const per_page = 3;
                    const max_page = Math.ceil(user_db?.badges?.length / per_page);
                    let page = 1;

                    const get_embed = () => new EmbedBuilder()
                        .setColor(client.config.colors.main)
                        .setAuthor({ name: `${locale('commands.userinfo.author')} ${user.displayName}`, iconURL: message.author.displayAvatarURL() })
                        .addFields((user_db?.badges ?? []).slice((page - 1) * per_page, page * per_page).map(x => {
                            const badge = client.config.badges.find(b => b.id === x);

                            return {
                                name: `${badge?.emojis?.default} ${locale(badge.name)}`,
                                value: '*' + locale(badge.description) + '*',
                                inline: true
                            };
                        }))

                    const get_components = () => [
                        new ActionRowBuilder<StringSelectMenuBuilder>()
                            .addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId('user_info_select_menu')
                                    .setPlaceholder(locale('commands.userinfo.select_menu_placeholder'))
                                    .addOptions(
                                        new StringSelectMenuOptionBuilder()
                                            .setLabel(locale('commands.userinfo.select_menu_1'))
                                            .setValue('back')
                                            .setDescription(locale('commands.userinfo.select_menu_1_description'))
                                            .setEmoji(client.config.emojis.back),
                                        new StringSelectMenuOptionBuilder()
                                            .setDefault(true)
                                            .setLabel(locale('commands.userinfo.select_menu_2'))
                                            .setValue('badges')
                                            .setDescription(locale('commands.userinfo.select_menu_2_description'))
                                            .setEmoji(client.config.emojis.total),
                                    )
                            ),
                        new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('userinfo_badge.prev')
                                    .setEmoji(client.config.emojis.previous)
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(page === 1),
                                new ButtonBuilder()
                                    .setCustomId('userinfo_badge.next')
                                    .setEmoji(client.config.emojis.next)
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(!featured_badge ? true : page === max_page)
                            )
                    ];

                    await i.update({
                        embeds: [get_embed()],
                        components: get_components()
                    });

                    const collector = client.managers.Collector({
                        msg,
                        channel: message.channel,
                        filter: i => i.user.id === message.author.id && i.message.id === msg.id,
                        time: 6000 * 10 * 10
                    });

                    collector.on('collect', async (i) => {
                        if (!i.isButton()) return;

                        if (i.customId === 'userinfo_badge.prev') {
                            page--;
                        } else if (i.customId === 'userinfo_badge.next') {
                            page++;
                        };

                        await i.update({
                            embeds: [get_embed()],
                            components: get_components()
                        });
                    });
                } else if (value === 'back') {
                    await i.update({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.config.colors.main)
                                .setAuthor({ name: `${locale('commands.userinfo.author')} ${user.displayName}`, iconURL: message.author.displayAvatarURL() })
                                .setFooter({ text: locale('commands.userinfo.footer'), iconURL: client.config.icons.info })
                                .setTimestamp()
                                .addFields(
                                    (locale as any)('commands.userinfo.fields')
                                        .map((field: any) => ({
                                            name: field.name,
                                            value: field.value.join('\n')
                                                .replace('{displayName}', user.displayName)
                                                .replace('{username}', user.username)
                                                .replace('{id}', user.id)
                                                .replace('{created}', `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`)
                                                .replace('{joined}', `<t:${Math.floor(message.guild.members.cache.get(user.id).joinedTimestamp / 1000)}:R>`)
                                                .replace('{coin}', user_db?.amount?.toLocaleString() || 0)
                                                .replace('{darkium}', user_db?.darkium?.toLocaleString() || 0)
                                                .replace('{total_badge}', user_db?.badges?.length || 0)
                                                .replace('{dp_used}', `<t:${Math.floor(used_at_to_time / 1000)}:R>`)
                                                .replace('{platform}', platforms.join(', '))
                                                .replace('{status}', member.presence?.status === 'online' ? locale('commands.userinfo.status.online') : member.presence?.status === 'idle' ? locale('commands.userinfo.status.idle') : member.presence?.status === 'dnd' ? locale('commands.userinfo.status.dnd') : locale('commands.userinfo.status.offline'))
                                                .replace('{user_activity}', member.presence?.activities[0]?.name ? locale('commands.userinfo.activity.yes') : locale('commands.userinfo.activity.unknown'))
                                                .replace('{featured_badge}', !featured_badge ? locale('commands.userinfo.no_badge_found') : `${featured_badge?.emojis?.big[0][0]}${featured_badge?.emojis?.big[0][1]} **${locale(featured_badge?.name)}** \n${featured_badge?.emojis?.big[1][0]}${featured_badge?.emojis?.big[1][1]} *${locale(featured_badge.description)}*`),
                                            inline: field.inline
                                        }))
                                )
                        ],
                        components: [
                            new ActionRowBuilder<StringSelectMenuBuilder>()
                                .addComponents(
                                    new StringSelectMenuBuilder()
                                        .setCustomId('user_info_select_menu')
                                        .setPlaceholder(locale('commands.userinfo.select_menu_placeholder'))
                                        .addOptions(
                                            new StringSelectMenuOptionBuilder()
                                                .setDefault(true)
                                                .setLabel(locale('commands.userinfo.select_menu_1'))
                                                .setValue('back')
                                                .setDescription(locale('commands.userinfo.select_menu_1_description'))
                                                .setEmoji(client.config.emojis.back),
                                            new StringSelectMenuOptionBuilder()
                                                .setLabel(locale('commands.userinfo.select_menu_2'))
                                                .setValue('badges')
                                                .setDescription(locale('commands.userinfo.select_menu_2_description'))
                                                .setEmoji(client.config.emojis.total),
                                        )
                                )
                        ]
                    });
                };
            };
        });
    }
};