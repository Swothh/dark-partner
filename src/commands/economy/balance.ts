import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { Commands } from '../../structures';
import { User } from '../../models';

export const Command: Commands = {
    name: 'balance',
    description: 'Hesap işlemlerinizi ve bakiyenizi gösterir.',
    aliases: ['bakiye', 'bakiye-göster', 'bakiye-goster', 'bakiyem', 'bakiyem-göster', 'bakiyem-goster', 'geçmiş', 'bakıye', 'bal', 'cüzdan'],
    category: 'economy',
    cooldown: 5000,
    run: async (client, message, args, locale) => {
        const user = await User.findOne({ user: message.author.id }, { amount: 1, history: 1, darkium: 1, _id: 0 });

        function formatNumberToDate(number: number) {
            const date = new Date(number);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const hour = date.getHours();
            const minute = date.getMinutes();
            const second = date.getSeconds();

            return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
        };

        const embed = new EmbedBuilder()
            .setColor(client.config.colors.main)
            .setAuthor({ name: `${locale('commands.balance.author')} — ${message.author.displayName}`, iconURL: message.author.displayAvatarURL() })
            .setThumbnail('https://media.discordapp.net/attachments/1112377437658026034/1132076971690577970/4159689.png')
            .addFields({
                name: locale('commands.balance.wallet'),
                value: `__*${(user?.amount ?? 0).toLocaleString()} ${client.config.emojis.coin}*__`,
                inline: true
            }, {
                name: locale('commands.balance.darkium'),
                value: `__*${(user?.darkium ?? 0).toLocaleString()} ${client.config.emojis.darkium}*__`,
                inline: true
            }, {
                name: locale('commands.balance.history'),
                value: `${user?.history?.length ? user?.history?.sort((a, b) => b.date - a.date)?.map((v, i) => `${v.amount < 0 ? `📤` : `📥`} **•** ${locale(`commands.balance.reasons.${v.reason}`)} __*${Math.abs(v.amount ?? 0).toFixed(1)}*__ :person_pouting: __*${v.staff === 'System' ? 'System' : `<@${v.staff}>`}*__ **—** \`\` ${formatNumberToDate(v.date)} \`\``).slice(0, 5).join('\n') : locale('commands.balance.history_empty')}\n${locale('commands.balance.info')}`
            });


        const msg = await message.nmReply({
            embeds: [embed],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('balance:all')
                            .setEmoji('📜')
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId('balance:info')
                            .setEmoji('ℹ️')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('balance:delete')
                            .setEmoji('🗑️')
                            .setStyle(ButtonStyle.Secondary)
                    )
            ]
        });

        const collector = client.managers.Collector({
            msg,
            channel: message.channel,
            componentType: ComponentType.Button,
            time: 60000,
            filter: i => i.user.id === message.author.id && i.message.id === msg.id,
        });

        collector.on('collect', async (i) => {
            if (!i.isButton()) return;

            if (i.customId === 'balance:all') {
                await i.deferUpdate();

                let page = 1;
                let per_page = 6;
                let max_page = Math.round(user?.history?.length / per_page);

                const get_embed = async () => {
                    let part: any[] = (user?.history || []).slice((page - 1) * per_page, (page) * per_page);

                    const embed = new EmbedBuilder()
                        .setAuthor({ name: `${locale('commands.balance.author')} — ${message.author.displayName}`, iconURL: message.author.displayAvatarURL() })
                        .setColor(client.config.colors.main)
                        .setFooter({ text: locale('commands.balance.listed_footer'), iconURL: client.config.icons.info })
                        .setTimestamp();

                    if (part.length === 0) return embed.setDescription(locale('commands.balance.history_empty'));

                    const items = await Promise.all(part);
                    items.forEach((item, index) => {
                        if (!item) return;

                        embed.setDescription(
                            `${index === 0 ? '' : embed.data.description}\n${item.amount < 0 ? `📤` : `📥`} ${locale(`commands.balance.reasons.${item.reason}`)} __*${Math.abs(item.amount ?? 0).toFixed(1)}*__ :person_pouting: __*${item.staff === 'System' ? 'System' : `<@${item.staff}>`}*__ **—** **—** \`\` ${formatNumberToDate(item.date)} \`\``
                        );
                    });

                    return embed;
                };

                const get_components = () => {
                    const previous = new ButtonBuilder()
                        .setCustomId('balance:previous')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(client.config.emojis.previous);

                    const previous_10 = new ButtonBuilder()
                        .setCustomId('balance:previous_10')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(client.config.emojis.previous)
                        .setLabel('10');

                    const next = new ButtonBuilder()
                        .setCustomId('balance:next')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(client.config.emojis.next);

                    const next_10 = new ButtonBuilder()
                        .setCustomId('balance:next_10')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(client.config.emojis.next)
                        .setLabel('10');

                    const counter = new ButtonBuilder()
                        .setCustomId('balance:counter')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true)
                        .setLabel(`${page}/${max_page}`);

                    const back = new ButtonBuilder()
                        .setCustomId('balance:back')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(client.config.emojis.back);

                    if (page === 1) {
                        previous.setDisabled(true);
                        previous_10.setDisabled(true);
                    };

                    if (page === max_page) next.setDisabled(true);

                    if (max_page < 10) {
                        previous_10.setDisabled(true);
                        next_10.setDisabled(true);
                    };

                    return new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(previous_10, previous, next, next_10, back);
                };

                const msg_2 = await msg.edit({
                    embeds: [await get_embed()],
                    components: [get_components()]
                });

                const collector = client.managers.Collector({
                    msg,
                    channel: message.channel,
                    componentType: ComponentType.Button,
                    time: 60000,
                    filter: i => i.user.id === message.author.id && i.message.id === msg.id,
                });

                collector.on('collect', async (i) => {
                    await i.deferUpdate();

                    if (i.customId === 'balance:previous') {
                        page--;
                        await msg_2.edit({
                            embeds: [await get_embed()],
                            components: [get_components()]
                        });
                    };

                    if (i.customId === 'balance:previous_10') {
                        page -= 10;
                        await msg_2.edit({
                            embeds: [await get_embed()],
                            components: [get_components()]
                        });
                    };

                    if (i.customId === 'balance:next') {
                        page++;
                        await msg_2.edit({
                            embeds: [await get_embed()],
                            components: [get_components()]
                        });
                    };

                    if (i.customId === 'balance:next_10') {
                        page += 10;
                        await msg_2.edit({
                            embeds: [await get_embed()],
                            components: [get_components()]
                        });
                    };

                    if (i.customId === 'balance:back') {
                        collector.stop();

                        await msg_2.edit({
                            embeds: [embed],
                            components: [
                                new ActionRowBuilder<ButtonBuilder>()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setCustomId('balance:all')
                                            .setEmoji('📜')
                                            .setStyle(ButtonStyle.Primary),
                                        new ButtonBuilder()
                                            .setCustomId('balance:info')
                                            .setEmoji('ℹ️')
                                            .setStyle(ButtonStyle.Secondary),
                                        new ButtonBuilder()
                                            .setCustomId('balance:delete')
                                            .setEmoji('🗑️')
                                            .setStyle(ButtonStyle.Secondary)
                                    )
                            ]
                        });
                    };
                });
            };

            if (i.customId === 'balance:info') {
                await i.reply({
                    content: locale('commands.balance.info_btn'),
                    ephemeral: true
                });
            };

            if (i.customId === 'balance:delete') {
                if (i.message.deletable) i.message.delete().catch(() => { });
            };
        });
    }
};