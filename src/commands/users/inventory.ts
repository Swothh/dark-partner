import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { Commands } from '../../structures';
import { User, Guild } from '../../models';
import { InteractionUtils, ModalUtils } from '../../utils';

export const Command: Commands = {
    name: 'envanter',
    description: 'desc.envanter',
    aliases: ['inventory', 'inv'],
    category: 'users',
    cooldown: 5000,
    run: async (client, message, args, locale) => {
        let user = await User.findOne({ user: message.author.id }, { inventory: 1, badges: 1 });
        if (user?.inventory?.filter(c => c.type !== 'case')?.length === 0) return await message.error(locale('commands.inventory.no_item'));

        const per_page = 3;
        let max_page = Math.ceil((user?.inventory ?? []).filter(c => c.type !== 'case').length / per_page);
        let page = 1;

        const get_embed = () => new EmbedBuilder()
            .setColor(client.config.colors.main)
            .setAuthor({ name: `${message.author.displayName} ${locale('commands.inventory.author')}`, iconURL: message.author.displayAvatarURL() })
            .setFooter({ text: locale('commands.inventory.footer'), iconURL: client.config.icons.case })
            .setTimestamp()
            .addFields((user?.inventory ?? []).filter(c => c.type !== 'case').filter(c => c.total > 0).slice((page - 1) * per_page, page * per_page).map(x => ({
                name: `‧ ${locale(`cases.items.${x.id}`)}`,
                value: `**╰** ${locale('commands.inventory.item_desc', { amount: String(x.total) })}`,
                inline: true
            })));

        const get_components = () => [
            new ActionRowBuilder<StringSelectMenuBuilder>()
                /*.addComponents(...user?.inventory?.filter(c => c.type !== 'case')?.slice((page - 1) * per_page, page * per_page).map(x => new ButtonBuilder()
                    .setCustomId(`inventory.item.${x.id}`)
                    .setLabel('sa')
                    .setStyle(ButtonStyle.Secondary)
                ))*/
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(`inventory.item-${Math.floor(Math.random() * 1000)}`)
                        .setPlaceholder(locale('commands.inventory.select_item'))
                        .addOptions((user?.inventory ?? []).filter(c => c.type !== 'case').filter(c => c.total > 0).slice((page - 1) * per_page, page * per_page).map(x => ({
                            label: locale(`cases.items.${x.id}`),
                            value: x.id,
                            description: locale('commands.inventory.item_select_desc', { item: locale(`cases.items.${x.id}`) }),
                            emoji: client.config.emojis.items[x.id as keyof typeof client.config.emojis.items] as string,
                        })))
                ),
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('inventory.prev')
                        .setEmoji(client.config.emojis.previous)
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === 1),
                    new ButtonBuilder()
                        .setCustomId('inventory.next')
                        .setEmoji(client.config.emojis.next)
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === max_page)
                )
        ];

        const msg = await message.nmReply({
            embeds: [get_embed()],
            components: get_components()
        });

        const collector = client.managers.Collector({
            msg,
            channel: message.channel,
            time: 60000,
            filter: i => i.user.id === message.author.id && i.message.id === msg.id,
        });

        collector.on('collect', async int => {
            if (!int.isButton() && !int.isStringSelectMenu()) return;

            if (int.customId === 'inventory.prev') {
                page = Math.max(1, page - 1);
                await int.update({
                    embeds: [get_embed()],
                    components: [
                        new ActionRowBuilder<StringSelectMenuBuilder>()
                            .addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId(`inventory.item.${Math.floor(Math.random() * 1000)}`)
                                    .setPlaceholder(locale('commands.inventory.select_item'))
                                    .addOptions((user?.inventory ?? []).filter(c => c.type !== 'case').slice((page - 1) * per_page, page * per_page).map(x => ({
                                        label: locale(`cases.items.${x.id}`),
                                        value: x.id,
                                        description: locale('commands.inventory.item_select_desc', { item: locale(`items.${x.id}`) }),
                                        emoji: client.config.emojis.items[x.id as keyof typeof client.config.emojis.items] as string,
                                    })))
                            ),
                        new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('inventory.prev')
                                    .setEmoji(client.config.emojis.previous)
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(page === 1),
                                new ButtonBuilder()
                                    .setCustomId('inventory.next')
                                    .setEmoji(client.config.emojis.next)
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(page === max_page)
                            )
                    ]
                }).catch(() => { });
            } else if (int.customId === 'inventory.next') {
                page = Math.min(max_page, page + 1);
                await int.update({
                    embeds: [get_embed()],
                    components: [
                        new ActionRowBuilder<StringSelectMenuBuilder>()
                            .addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId(`inventory.item.${Math.floor(Math.random() * 1000)}`)
                                    .setPlaceholder(locale('commands.inventory.select_item'))
                                    .addOptions((user?.inventory ?? []).filter(c => c.type !== 'case').slice((page - 1) * per_page, page * per_page).map(x => ({
                                        label: locale(`cases.items.${x.id}`),
                                        value: x.id,
                                        description: locale('commands.inventory.item_select_desc', { item: locale(`items.${x.id}`) }),
                                        emoji: client.config.emojis.items[x.id as keyof typeof client.config.emojis.items] as string,
                                    })))
                            ),
                        new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('inventory.prev')
                                    .setEmoji(client.config.emojis.previous)
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(page === 1),
                                new ButtonBuilder()
                                    .setCustomId('inventory.next')
                                    .setEmoji(client.config.emojis.next)
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(page === max_page)
                            )
                    ]
                }).catch(() => { });
            } else if (int.isStringSelectMenu() && int.customId.startsWith('inventory.item')) {
                user = await User.findOne({ user: message.author.id }, { inventory: 1, badges: 1 });
                let value = int.values[0];

                if (value === 'partner_random') {
                    const create_modal = new client.managers.ModalManager(client, int);
                    const modal = await create_modal.build(`inventory.partner_random-${Math.floor(Math.random() * 1000)}`, {
                        modal: new ModalBuilder()
                            .setTitle(locale('commands.inventory.modals.title', { item: locale(`cases.items.${value}`) }))
                            .addComponents(
                                new ActionRowBuilder<TextInputBuilder>()
                                    .addComponents(
                                        new TextInputBuilder()
                                            .setCustomId('inventory.value.input')
                                            .setLabel(locale('commands.inventory.modals.input_label'))
                                            .setPlaceholder(user.inventory.find(x => x.id === value)?.total.toLocaleString() ?? '0')
                                            .setStyle(TextInputStyle.Short)
                                            .setMaxLength(user.inventory.find(x => x.id === value)?.total.toLocaleString().length)
                                            .setRequired(true)
                                    )
                            )
                    });

                    const v = modal.fields.getTextInputValue('inventory.value.input');
                    await modal.deferReply({ ephemeral: true });

                    const modal_interaction = await ModalUtils(client, modal);
                    if (user.inventory.find(x => x.id === value)?.total < Number(v)) return await modal_interaction.error(locale('commands.inventory.modals.not_enough'));

                    if (user.inventory.find(x => x.id === value)?.total - Number(v) < 1) {
                        await User.updateOne({ user: message.author.id }, {
                            $pull: { 'inventory': { id: value } }
                        }, { upsert: true });

                        await Guild.updateOne({ guildId: message.guild.id }, { $inc: { 'subscriptions.partner_random': Number(v) } }, { upsert: true });
                        await modal_interaction.success(locale('commands.inventory.modals.success_with_sw', { item: locale(`cases.items.${value}`), amount: v }));

                        user = await User.findOne({ user: message.author.id }, { inventory: 1, badges: 1 });
                        page = 1;
                        await msg.edit({
                            embeds: [get_embed()],
                            components: [
                                new ActionRowBuilder<StringSelectMenuBuilder>()
                                    .addComponents(
                                        new StringSelectMenuBuilder()
                                            .setCustomId(`inventory.item.${Math.floor(Math.random() * 1000)}`)
                                            .setPlaceholder(locale('commands.inventory.select_item'))
                                            .addOptions((user?.inventory ?? []).filter(c => c.type !== 'case').slice((page - 1) * per_page, page * per_page).map(x => ({
                                                label: locale(`cases.items.${x.id}`),
                                                value: x.id,
                                                description: locale('commands.inventory.item_select_desc', { item: locale(`items.${x.id}`) }),
                                                emoji: client.config.emojis.items[x.id as keyof typeof client.config.emojis.items] as string,
                                            })))
                                    ),
                                new ActionRowBuilder<ButtonBuilder>()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setCustomId('inventory.prev')
                                            .setEmoji(client.config.emojis.previous)
                                            .setStyle(ButtonStyle.Primary)
                                            .setDisabled(page === 1),
                                        new ButtonBuilder()
                                            .setCustomId('inventory.next')
                                            .setEmoji(client.config.emojis.next)
                                            .setStyle(ButtonStyle.Primary)
                                            .setDisabled(page === max_page)
                                    )
                            ]
                        });
                        return;
                    };

                    await Promise.all([
                        await User.updateOne({ user: message.author.id, 'inventory.id': value }, { $inc: { 'inventory.$.total': -Number(v) } }, { upsert: true }),
                        await Guild.updateOne({ guildId: message.guild.id }, { $inc: { 'subscriptions.partner_random': Number(v) } }, { upsert: true })
                    ]);

                    user = await User.findOne({ user: message.author.id }, { inventory: 1, badges: 1 });
                    page = 1;
                    max_page = Math.ceil((user?.inventory ?? []).filter(c => c.type !== 'case').length / per_page);
                    await msg.edit({
                        embeds: [get_embed()],
                        components: [
                            new ActionRowBuilder<StringSelectMenuBuilder>()
                                .addComponents(
                                    new StringSelectMenuBuilder()
                                        .setCustomId(`inventory.item.${Math.floor(Math.random() * 1000)}`)
                                        .setPlaceholder(locale('commands.inventory.select_item'))
                                        .addOptions((user?.inventory ?? []).filter(c => c.type !== 'case').slice((page - 1) * per_page, page * per_page).map(x => ({
                                            label: locale(`cases.items.${x.id}`),
                                            value: x.id,
                                            description: locale('commands.inventory.item_select_desc', { item: locale(`items.${x.id}`) }),
                                            emoji: client.config.emojis.items[x.id as keyof typeof client.config.emojis.items] as string,
                                        })))
                                ),
                            new ActionRowBuilder<ButtonBuilder>()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('inventory.prev')
                                        .setEmoji(client.config.emojis.previous)
                                        .setStyle(ButtonStyle.Primary)
                                        .setDisabled(page === 1),
                                    new ButtonBuilder()
                                        .setCustomId('inventory.next')
                                        .setEmoji(client.config.emojis.next)
                                        .setStyle(ButtonStyle.Primary)
                                        .setDisabled(page === max_page)
                                )
                        ]
                    });

                    await modal_interaction.success(locale('commands.inventory.modals.success_with_sw', { item: locale(`cases.items.${value}`), amount: v }));
                };

                if (value.startsWith('badge')) {
                    const i = await InteractionUtils(client, int, 'deny');

                    if (user?.badges?.includes(value)) return i.error(locale('commands.inventory.already_have'));
                    if (user?.inventory.find(x => x.id === value)?.total < 1) return i.error(locale('commands.inventory.not_enough'));

                    if (user.inventory.find(x => x.id === value)?.total - 1 < 1) {
                        await User.updateOne({ user: message.author.id }, {
                            $pull: { 'inventory': { id: value } },
                            $push: { 'badges': value }
                        }, { upsert: true });

                        return await i.success(locale('commands.inventory.success', { item: locale(`cases.items.${value}`), amount: '1' }));
                    };

                    await User.updateOne({ user: message.author.id, 'inventory.id': value }, {
                        $inc: { 'inventory.$.total': -1 },
                        $push: { 'badges': value }
                    }, { upsert: true });

                    user = await User.findOne({ user: message.author.id }, { inventory: 1, badges: 1 });
                    page = 1;
                    max_page = Math.ceil((user?.inventory ?? []).filter(c => c.type !== 'case').length / per_page);
                    await msg.edit({
                        embeds: [get_embed()],
                        components: [
                            new ActionRowBuilder<StringSelectMenuBuilder>()
                                .addComponents(
                                    new StringSelectMenuBuilder()
                                        .setCustomId(`inventory.item.${Math.floor(Math.random() * 1000)}`)
                                        .setPlaceholder(locale('commands.inventory.select_item'))
                                        .addOptions((user?.inventory ?? []).filter(c => c.type !== 'case').slice((page - 1) * per_page, page * per_page).map(x => ({
                                            label: locale(`cases.items.${x.id}`),
                                            value: x.id,
                                            description: locale('commands.inventory.item_select_desc', { item: locale(`items.${x.id}`) }),
                                            emoji: client.config.emojis.items[x.id as keyof typeof client.config.emojis.items] as string,
                                        })))
                                ),
                            new ActionRowBuilder<ButtonBuilder>()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('inventory.prev')
                                        .setEmoji(client.config.emojis.previous)
                                        .setStyle(ButtonStyle.Primary)
                                        .setDisabled(page === 1),
                                    new ButtonBuilder()
                                        .setCustomId('inventory.next')
                                        .setEmoji(client.config.emojis.next)
                                        .setStyle(ButtonStyle.Primary)
                                        .setDisabled(page === max_page)
                                )
                        ]
                    });

                    await i.success(locale('commands.inventory.success', { item: locale(`cases.items.${value}`), amount: '1' }));
                };
            };
        });
    }
};