import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, ColorResolvable } from 'discord.js';
import { Commands } from '../../structures';
import { User } from '../../models';
import { InteractionUtils } from '../../utils';
import { Tasks } from '../../managers';

export const Command: Commands = {
    name: 'kasa',
    description: 'desc.case',
    aliases: ['case'],
    category: 'users',
    cooldown: 5000,
    run: async (client, message, args, locale) => {
        let user = await User.findOne({ user: message.author.id }, { amount: 1, inventory: 1 });
        if ((user?.inventory ?? [])?.filter(x => x.type === 'case').length === 0) return message.nmReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.colors.main)
                    .setAuthor({ name: `${message.author.displayName} ${locale('commands.case.author')}`, iconURL: message.author.displayAvatarURL() })
                    .setFooter({ text: locale('commands.case.footer'), iconURL: client.config.icons.case })
                    .setTimestamp()
                    .setDescription(locale('commands.case.no_item'))
            ]
        });

        const per_page = 3;
        const max_page = Math.ceil((user?.inventory ?? [])?.filter(x => x.type === 'case').length / per_page);
        let page = 1;

        const get_embed = () => new EmbedBuilder()
            .setColor(client.config.colors.main)
            .setAuthor({ name: `${message.author.displayName} ${locale('commands.case.author')}`, iconURL: message.author.displayAvatarURL() })
            .setFooter({ text: locale('commands.case.footer'), iconURL: client.config.icons.case })
            .setTimestamp()
            .addFields((user?.inventory ?? [])?.filter(x => x.type === 'case').slice((page - 1) * per_page, page * per_page).map(x => ({
                name: `${client.config.cases.find(c => c.id === x.id)?.emoji || '❓'} ‧ ${locale(`cases.${x.id}`)}`,
                value: (locale as any)('commands.case.item_desc').join('\n')
                    .replace('{total}', x.total)
                    .replace('{price}', (client.config.prices.case as any)[x.id])
                    .replace('{epic_rate}', Math.round(client.config.cases.find(c => c.id === x.id)?.items.find(i => i.type === 'epic')?.ratio * 100))
                    .replace('{rare_rate}', Math.round(client.config.cases.find(c => c.id === x.id)?.items.find(i => i.type === 'rare')?.ratio * 100))
                    .replace('{common_rate}', Math.round(client.config.cases.find(c => c.id === x.id)?.items.find(i => i.type === 'ordinary')?.ratio * 100)),
                inline: true
            })));

        const get_components = () => [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('case.prev')
                        .setEmoji(client.config.emojis.previous)
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === 1),
                    new ButtonBuilder()
                        .setCustomId('case.next')
                        .setEmoji(client.config.emojis.next)
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === max_page)
                ),
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(...user?.inventory?.filter(x => x.type === 'case').slice((page - 1) * per_page, page * per_page).map(x => new ButtonBuilder()
                    .setCustomId(`case.item.${x.id}`)
                    .setLabel(locale(`cases.${x.id}`))
                    .setEmoji(client.config.cases.find(c => c.id === x.id)?.emoji || '❓')
                    .setStyle(ButtonStyle.Secondary)
                ))
        ];

        const msg = await message.nmReply({
            embeds: [get_embed()],
            components: get_components()
        });

        const collector = client.managers.Collector({
            msg,
            channel: message.channel,
            componentType: ComponentType.Button,
            time: 60000,
            filter: i => i.user.id === message.author.id && i.message.id === msg.id,
        });

        collector.on('collect', async int => {
            if (!int.isButton()) return;

            const i = await InteractionUtils(client, int);
            if (!i.isButton()) return;

            if (int.customId === 'case.prev') {
                page = Math.max(1, page - 1);
                await i.update({
                    embeds: [get_embed()],
                    components: get_components()
                }).catch(() => { });
            } else if (int.customId === 'case.next') {
                page = Math.min(max_page, page + 1);
                await i.update({
                    embeds: [get_embed()],
                    components: get_components()
                }).catch(() => { });
            } else if (int.customId.startsWith('case.item')) {
                user = await User.findOne({ user: message.author.id }, { amount: 1, inventory: 1 });

                if (client.caseWaiting.has(message.author.id)) {
                    await i.deferReply({ ephemeral: true });
                    await i.error(locale('commands.case.waiting'));

                    return;
                };

                const item = user?.inventory?.find(x => x.id === int.customId.split('.')[2]);
                const item_without_db = client.config.cases.find(x => x.id === int.customId.split('.')[2]);

                if (!item || item.total < 1) {
                    await i.deferReply({ ephemeral: true });
                    await i.error(locale('commands.case.no_item'));

                    return;
                };

                client.caseWaiting.set(message.author.id, true);
                await i.message.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.config.colors.main)
                            .setTitle(`${locale(`cases.${item.id}`)} — ${locale('commands.case.opening')}`)
                            .setThumbnail(item_without_db.img)
                            .setDescription(locale('commands.case.opening_desc', { case: locale(`cases.${item.id}`) }))
                    ],
                    components: []
                });

                const total_ratio = item_without_db.items.reduce((a, b) => a + b.ratio, 0);
                const random = Math.random() * total_ratio;

                let selected: { id: string, color: ColorResolvable, type: string, db_type: string, img: string, name: string, ratio: number, total: number };
                let current = 0;

                for (const item of item_without_db.items) {
                    current += item.ratio;
                    if (random <= current) {
                        selected = item;
                        break;
                    };
                };

                setTimeout(async () => {
                    await i.message.edit({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.config.colors.types[selected.type as keyof typeof client.config.colors.types])
                                .setThumbnail(selected.img)
                                .setTitle(locale('commands.case.opened', { case: locale(`cases.${item.id}`) }))
                                .setDescription(locale(`cases.items.${item.id === 'badge' ? item.id : selected.id}_desc`, {
                                    type: locale(`cases.items.${selected.type}`),
                                    name: locale(`${selected.name}`)
                                }))
                                .addFields({
                                    name: locale('commands.case.type'),
                                    value: locale(`cases.items.${selected.type}`),
                                    inline: true
                                }, {
                                    name: locale('commands.case.name'),
                                    value: locale(`${selected.name}`),
                                    inline: true
                                }/*, {
                                    name: locale('commands.case.price'),
                                    value: 'Bura yapılcak moruq',
                                    inline: true
                                }*/)
                                .setFooter({ text: locale('commands.case.footer_opened'), iconURL: client.config.icons.info })
                                .setTimestamp()
                        ]
                    });

                    const task = new Tasks();
                    await task.update(message.author.id, 'case', 1).then(d => {
                        if (d.finished) {
                            message.sendTask('case', d.difficulty, d.prize);
                        };
                    });

                    if ((user?.inventory ?? [])?.find(i => i.id === `${selected.id}`)) {
                        await User.updateOne({ user: message.author.id, 'inventory.id': `${selected.id}` }, {
                            $inc: {
                                'inventory.$.total': selected.total
                            }
                        }, { upsert: true });
                    } else {
                        await User.updateOne({ user: message.author.id }, {
                            $push: {
                                inventory: {
                                    type: selected.db_type,
                                    id: `${selected.id}`,
                                    total: selected.total
                                }
                            }
                        }, { upsert: true });
                    };

                    if (user?.inventory?.find(i => i.id === `${item.id}`)?.total === 1) {
                        await User.updateOne({ user: message.author.id }, {
                            $pull: {
                                inventory: {
                                    type: 'case',
                                    id: `${item.id}`,
                                    total: 1
                                }
                            }
                        }, { upsert: true });
                    } else {
                        await User.updateOne({ user: message.author.id, 'inventory.id': `${item.id}` }, {
                            $inc: {
                                'inventory.$.total': -1
                            }
                        }, { upsert: true });
                    };

                    client.caseWaiting.delete(message.author.id);
                }, 5000);
            };
        });
    }
};