import { Commands } from '../../structures';
import { Guild } from '../../models';
import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ComponentType } from 'discord.js';
import { nanoid } from 'nanoid';

export const Status: Commands['run'] = async (client, message, args, locale) => {
    const guild_db = await Guild.findOne({ guildId: message.guild.id });

    if (guild_db?.partner?.status === 1) {
        await Guild.updateOne({ guildId: message.guild.id }, {
            $set: {
                'partner.status': false
            }
        }, { upsert: true });

        return message.success(locale('commands.partner.status.success_disable'));
    };

    if (!guild_db?.partner?.text || !guild_db?.partner?.channel || !guild_db?.partner?.log || !guild_db?.partner?.staff) {
        const not_set = {
            text: !guild_db?.partner?.text ? locale('commands.partner.status.text') : '',
            channel: !guild_db?.partner?.channel ? locale('commands.partner.status.channel') : '',
            log: !guild_db?.partner?.log ? locale('commands.partner.status.log') : '',
            staff: !guild_db?.partner?.staff ? locale('commands.partner.status.staff') : ''
        };

        return message.error(locale('commands.partner.status.not_set', {
            not_set: Object.values(not_set).filter(x => x).join(', ')
        }));
    };

    const msg = await message.nmReply({
        embeds: [
            new EmbedBuilder()
                .setColor(client.config.colors.main)
                .setAuthor({ name: `${locale('commands.partner.status.author')} — ${message.author.username}`, iconURL: message.author.avatarURL() })
                .setFooter({ text: locale('commands.partner.status.footer'), iconURL: client.config.icons.category })
                .setDescription(locale('commands.partner.status.description'))
                .addFields({
                    name: locale('commands.partner.status.fields_1_name'),
                    value: locale('commands.partner.status.fields_1_value')
                })
        ],
        components: [
            new ActionRowBuilder<StringSelectMenuBuilder>()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('partner_status_category')
                        .setPlaceholder(locale('commands.partner.status.menu_placeholder'))
                        .addOptions(client.config.categories(locale).map(x => ({
                            label: x.label,
                            value: x.value,
                            description: x.description,
                            emoji: x.emoji
                        })))
                )
        ]
    });

    const collector = client.managers.Collector({
        msg,
        channel: message.channel,
        componentType: ComponentType.StringSelect,
        time: 60000,
        filter: i => i.user.id === message.author.id && i.message.id === msg.id,
    });

    collector.on('collect', async (i) => {
        if (!i.isStringSelectMenu()) return;
        if (!i.customId.startsWith('partner_status')) return;

        const category = i.values[0];
        const category_name = client.config.categories(locale).find(x => x.value === category)?.label;
        const id = `dp_${nanoid(12).toLowerCase()}`

        await Guild.updateOne({ guildId: message.guild.id }, {
            $set: {
                'partner.status': 1,
                'partner.category': category,
                'partner.url': id
            }
        }, { upsert: true });

        await i.update({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.colors.success)
                    .setAuthor({ name: `${locale('commands.partner.status.author')} — ${message.author.username}`, iconURL: message.author.avatarURL() })
                    .setFooter({ text: locale('commands.partner.status.footer_2'), iconURL: client.config.icons.success })
                    .setTimestamp()
                    .setDescription(locale('commands.partner.status.success', { category: category_name }))
                    .addFields({
                        name: locale('commands.partner.status.fields_2_name'),
                        value: locale('commands.partner.status.fields_2_value', {
                            id: id,
                        })
                    })
            ],
            components: []
        }).catch(() => { });

        collector.stop();
    });
};