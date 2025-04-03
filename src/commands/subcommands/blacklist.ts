import { Commands } from '../../structures';
import { Guild } from '../../models';
import { EmbedBuilder } from 'discord.js';

export const Blacklist: Commands['run'] = async (client, message, args, locale) => {
    const [subcommand, ...subargs] = args;
    const guild = await Guild.findOne({ guildId: message.guild.id }, { partner: 1, _id: 0 });

    if (guild?.partner?.status === 0) return message.error(locale('commands.partner.blacklist.errors_partner_status'));

    switch (subcommand) {
        case locale('commands.partner.blacklist.add'): {
            const value = args.slice(1).join(' ');
            if (!value) return message.error(locale('commands.partner.blacklist.errors_no_value'));

            const is_category = client.config.categories(locale).find(v => v.label.toLowerCase() === value.toLowerCase());
            if (!is_category && value.split(' ').length > 1) return message.error(locale('commands.partner.blacklist.errors_invalid_value'));
            if (is_category && guild?.partner?.blacklists?.categories?.includes(is_category.value)) return message.error(locale('commands.partner.blacklist.errors_category_already_blacklisted'));

            if (is_category) {
                await Guild.updateOne({ guildId: message.guild.id }, {
                    $push: {
                        'partner.blacklists.categories': is_category.value
                    }
                });

                await message.success(locale('commands.partner.blacklist.added_category', {
                    category: is_category.label
                }));
            } else {
                const [target_guild_db] = await Promise.all([
                    Guild.findOne({ $or: [{ 'partner.url': value }, { 'partner.specialUrl': value }, { guildId: value }] }),
                ]);

                if (!target_guild_db) return message.error(locale('commands.partner.blacklist.errors_invalid_guild'));
                if (guild?.partner?.blacklists?.guilds?.includes(target_guild_db.guildId)) return message.error(locale('commands.partner.blacklist.errors_guild_already_blacklisted'));

                await Guild.updateOne({ guildId: message.guild.id }, {
                    $push: {
                        'partner.blacklists.guilds': target_guild_db.guildId
                    }
                });

                await message.success(locale('commands.partner.blacklist.added_guild', {
                    id: target_guild_db.guildId
                }));
            };

            break;
        };

        case locale('commands.partner.blacklist.remove'): {
            const value = args.slice(1).join(' ');
            if (!value) return message.error(locale('commands.partner.blacklist.errors_no_value'));

            const is_category = client.config.categories(locale).find(v => v.label.toLowerCase() === value.toLowerCase());
            if (!is_category && value.split(' ').length > 1) return message.error(locale('commands.partner.blacklist.errors_invalid_value'));
            if (is_category && !guild?.partner?.blacklists?.categories?.includes(is_category.value)) return message.error(locale('commands.partner.blacklist.errors_category_not_blacklisted'));

            if (is_category) {
                await Guild.updateOne({ guildId: message.guild.id }, {
                    $pull: {
                        'partner.blacklists.categories': is_category.value
                    }
                });

                await message.success(locale('commands.partner.blacklist.removed_category', {
                    category: is_category.label
                }));
            } else {
                const [target_guild_db] = await Promise.all([
                    Guild.findOne({ $or: [{ 'partner.url': value }, { 'partner.specialUrl': value }, { guildId: value }] }),
                ]);

                if (!target_guild_db) {
                    if (guild?.partner?.blacklists?.guilds?.includes(value)) {
                        await Guild.updateOne({ guildId: message.guild.id }, {
                            $pull: {
                                'partner.blacklists.guilds': value
                            }
                        });
                    };

                    await message.error(locale('commands.partner.blacklist.errors_invalid_guild'));
                    return;
                };


                if (!guild?.partner.blacklists?.guilds?.includes(target_guild_db.guildId)) return message.error(locale('commands.partner.blacklist.errors_guild_not_blacklisted'));

                await Guild.updateOne({ guildId: message.guild.id }, {
                    $pull: {
                        'partner.blacklists.guilds': target_guild_db.guildId
                    }
                });

                await message.success(locale('commands.partner.blacklist.removed_guild', {
                    id: target_guild_db.guildId,
                }));
            };
            break;
        };

        case locale('commands.partner.blacklist.list'): {
            const data = [
                ...guild?.partner?.blacklists?.categories ?? [],
                ...guild?.partner?.blacklists?.guilds ?? []
            ];

            const page = new client.utils.AutoPager(client, data, {
                embed: new EmbedBuilder()
                    .setColor(client.config.colors.main)
                    .setAuthor({ name: `${locale('commands.partner.blacklist.list_author')} — ${message.guild.name}`, iconURL: message.guild.iconURL() })
                    .setFooter({ text: locale('commands.partner.blacklist.list_footer'), iconURL: client.config.icons.info })
                    .setTimestamp(),
                showIndex: true
            });

            page.build(locale, message);
            page.on('collect', p => {
                console.log(p);
            });

            break;
        };

        default: {
            return message.error(locale('commands.partner.blacklist.errors_invalid_subcommand'));
        };
    };
};