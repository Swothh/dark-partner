import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, StringSelectMenuBuilder } from 'discord.js';
import { Commands } from '../../structures';

export const Command: Commands = {
    name: 'rehber',
    description: 'Bir konu hakkında detaylı yardım alın.',
    aliases: ['guide', 'wiki', 'kılavuz'],
    category: 'bot',
    cooldown: 5000,
    requireds: {
        owner: true
    },
    run: async (client, message, args, locale) => {
        if (!client.guide) return message.error(locale('commands.guide.not_loaded'));
        const search = args.length === 0 ? false : args.join('');
        const userIso = locale.getSchema().iso ?? 'tr';

        const searchTerms = (client.guide.articles as any[] ?? []).map(article => {
            const terms: string[] = [
                article.name,
                ...Object.values(article?.locales ?? {}).map((lang: any) => lang?.data?.title)
            ].filter(t => !!t).map(t => t.toLowerCase().trim());

            return {
                name: article.name as string,
                loc: article.locales,
                terms
            };
        });

        if (search) {
            if (search.length < 3) return message.error(locale('commands.guide.min_search'));
            const results = searchTerms.filter(el => el.terms.some(t => t.includes(search))).slice(0, 25);

            const msg = await (results.length === 1 ? null : message.nmReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.colors.main)
                        .setTitle('🔎 │ ' + locale('commands.guide.search_result.title'))
                        .setDescription('• ' + locale('commands.guide.search_result.description'))
                ],
                components: [
                    new ActionRowBuilder<StringSelectMenuBuilder>()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('guide.search')
                                .setPlaceholder(locale('commands.guide.search_result.select'))
                                .setOptions(...results.map(r => ({
                                    label: (r.loc[userIso] || r.loc.tr)?.data?.title || '???',
                                    value: r.name,
                                    description: `${locale('commands.guide.search_result.category')}: ${(r.loc[userIso] || r.loc.tr)?.data?.category || '???'}`,
                                    emoji: '📜'
                                })))
                        )
                ]
            }));

            const showArticle = (id: string, reply?: boolean): void => {
                if (!client.guide) return;
                const article = (client.guide?.articles as any[] || []).find(a => a.name === id);
                if (!article) return msg.error(locale('commands.guide.not_found')) && void 0;
                const loc = article.locales[userIso] || article.locales.tr;

                const embed = new EmbedBuilder()
                    .setColor(client.config.colors.main)
                    .setTitle(loc?.data?.title || '???')
                    .setDescription(loc?.content || '???')
                    .setTimestamp();

                if (loc?.data?.image) embed.setImage(loc?.data?.image);
                if (loc?.data?.thumbnail) embed.setThumbnail(loc?.data?.thumbnail);
                if (loc?.data?.color) embed.setColor(loc?.data?.color);

                if (loc?.data?.author?.name) embed.setAuthor({
                    name: loc?.data?.author?.name,
                    iconURL: loc?.data?.author?.iconURL
                });

                if (loc?.data?.footer?.text) embed.setFooter({
                    text: loc?.data?.footer?.text,
                    iconURL: loc?.data?.footer?.iconURL
                });

                if (reply) {
                    message.nmReply({
                        embeds: [embed],
                        components: []
                    }).catch(() => { });
                } else {
                    msg.edit({
                        embeds: [embed],
                        components: []
                    }).catch(() => { });
                };
            };

            if (results.length === 1) return showArticle(
                results[0].name,
                true
            );

            const collector = message.channel.createMessageComponentCollector({
                componentType: ComponentType.StringSelect,
                filter: i => i.user.id === message.author.id && i.message.id === msg.id,
                time: 60000 * 5,
                max: 1
            });

            collector.on('collect', i => {
                collector.stop();
                return showArticle(i.values[0]);
            });
            return;
        };

        const categories: ICategory[] = [];
        (client.guide.articles as any[] ?? []).filter(a => a?.locales?.[userIso]).forEach(a => {
            const loc = a.locales[userIso];
            const isPushed = categories.find(c => c.name === loc?.data?.category);
            const thisArticle = `[\` ${a.name.split('-')[0]} \`](https://partnerbot.me) ${loc?.data?.title}`;

            const pushNew = () => categories.push({
                name: loc?.data?.category,
                articles: [thisArticle]
            });

            if (!isPushed || (isPushed.articles.reduce((a, b) => a + b.length + 2, 0) + thisArticle.length) > 1024) return pushNew();
            isPushed.articles.push(thisArticle);
        });

        let page = 1;
        const per_page = 25;
        const max_page = Math.ceil(categories.length / per_page);

        const getEmbeds = () => [
            new EmbedBuilder()
                .setColor(client.config.colors.main)
                .setTitle('📘 │ ' + locale('commands.guide.main.title'))
                .setDescription([
                    '• ' + locale('commands.guide.main.description._1'),
                    '• ' + locale('commands.guide.main.description._2', {
                        list: ((client.guide as any).collaborators as any[] || []).filter(el => !!el?.name).map(el => `**${el?.name?.replaceAll('*', '')}**`).join(', ')
                    })
                ].join('\n'))
                .setFooter({
                    text: locale('commands.guide.main.footer', {
                        link: 'guide.partnerbot.me'
                    }),
                    iconURL: 'https://cdn.discordapp.com/emojis/1139718408716435577.webp?size=96&quality=lossless'
                })
                .addFields(...categories.length === 0 ? [{ name: locale('commands.guide.main.not_found.name'), value: locale('commands.guide.main.not_found.value') }] : categories.slice((page - 1) * per_page, page * per_page).map(c => ({
                    name: `— ${c.name}`,
                    value: c.articles.join('\n'),
                    inline: true
                })))
        ];

        const getComps = () => [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('guide.previous')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === 1)
                        .setEmoji(client.config.emojis.previous),
                    new ButtonBuilder()
                        .setCustomId('guide.page')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true)
                        .setLabel(`${page}/${max_page}`),
                    new ButtonBuilder()
                        .setCustomId('guide.next')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === max_page)
                        .setEmoji(client.config.emojis.next)
                )
        ];

        const msg = await message.nmReply({
            embeds: getEmbeds(),
            components: getComps()
        });

        if (max_page === 1) return;
        const collector = client.managers.Collector({
            msg,
            channel: message.channel,
            componentType: ComponentType.Button,
            filter: i => i.user.id === message.author.id && i.message.id === msg.id,
            time: 60000 * 5
        });

        collector.on('collect', async i => {
            collector.resetTimer();
            i.deferUpdate().catch(() => { });

            switch (i.customId) {
                case 'guide.previous':
                    if (page !== 1) page--;
                    msg.edit({ embeds: getEmbeds(), components: getComps() }).catch(() => { });
                    break;
                case 'guide.next':
                    if (page !== max_page) page++;
                    msg.edit({ embeds: getEmbeds(), components: getComps() }).catch(() => { });
                    break;
            };
        });
    }
};

interface ICategory {
    name: string;
    articles: string[];
};