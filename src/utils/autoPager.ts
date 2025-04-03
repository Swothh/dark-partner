import Dark from '../client';
import { EmbedBuilder, Message, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType, ButtonInteraction } from 'discord.js';
import { JSONEncodable } from '@discordjs/util';
import { Localizer, Collector } from '../managers';
import { EventEmitter } from 'events';

interface AutoPageOptions {
    embed: EmbedBuilder,
    components?: any[],
    showIndex?: boolean,
    noDataFound?: string,
};

export class AutoPager {
    private emitter: EventEmitter = new EventEmitter();

    constructor(public client: Dark, public data: any[], public options: AutoPageOptions) {
        this.client = client;
        this.data = data;
        this.options = options;
    };

    public async build(locale: ReturnType<typeof Localizer>, message: Message) {
        const data = this.data;
        let per_page = 10;
        let page = 1;
        let max_page = Math.max(Math.ceil(data.length / per_page), 1);

        let start = (page - 1) * per_page;
        let end = start + per_page;

        const embed = this.options.embed;
        const components = this.options.components;

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

        const generate_embed = async () => {
            let part: any[] = (data).slice(start, end);

            if (part.length === 0) return embed.setDescription(
                this.options.noDataFound ?? locale('_global.page_not_found')
            );
            if (part.length !== 0 && part.length < per_page) part = [...part, ...Array(per_page - part.length).fill(null)];

            /*await Promise.all(part.map(async (item, index) => {
                if (!item) return;
                embed.setDescription(
                    `${embed.data.description ?? ''}\n${this.options.showIndex ? `**${(embed.data.description ?? '').split('\n').length + (page - 1) * per_page}.** ` : ''}${await item}`
                )
            }));*/


            const items = await Promise.all(part);
            items.forEach((item, index) => {
                if (!item) return;

                embed.setDescription(
                    `${index === 0 ? '' : embed.data.description}\n${this.options.showIndex ? `**${(index === 0 ? '' : embed.data.description).split('\n').length + (page - 1) * per_page}.** ` : ''}${item}`
                );
            });

            return embed;
        };

        const generate_components = async () => {
            const previous = new ButtonBuilder()
                .setCustomId('auto_page.previous')
                .setStyle(ButtonStyle.Primary)
                .setEmoji(this.client.config.emojis.previous);

            const previous_10 = new ButtonBuilder()
                .setCustomId('auto_page.previous_10')
                .setStyle(ButtonStyle.Primary)
                .setEmoji(this.client.config.emojis.previous)
                .setLabel('10');

            const next = new ButtonBuilder()
                .setCustomId('auto_page.next')
                .setStyle(ButtonStyle.Primary)
                .setEmoji(this.client.config.emojis.next);

            const next_10 = new ButtonBuilder()
                .setCustomId('auto_page.next_10')
                .setStyle(ButtonStyle.Primary)
                .setEmoji(this.client.config.emojis.next)
                .setLabel('10');

            const counter = new ButtonBuilder()
                .setCustomId('auto_page.counter')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true)
                .setLabel(`${page}/${max_page}`);

            if (page === 1) {
                previous.setDisabled(true);
                previous_10.setDisabled(true);
            };

            if (page === max_page) next.setDisabled(true);

            if (max_page < 10) {
                previous_10.setDisabled(true);
                next_10.setDisabled(true);
            };

            return new ActionRowBuilder()
                .addComponents(previous_10, previous, next, next_10, counter);
        };

        const msg = await message.nmReply({
            embeds: [
                await generate_embed()
            ],
            components: [
                ...(components ?? []),
                await generate_components()
            ]
        });

        const collector = Collector({
            msg,
            channel: message.channel,
            componentType: ComponentType.Button,
            time: 60000,
            filter: i => i.user.id === i.user.id && i.message.id === msg.id,
        });

        collector.on('collect', async i => {
            await i.deferUpdate();

            if (i.customId === 'auto_page.previous') {
                this.emitter.emit('collect', {
                    _transaction: 'previous',
                    page: page - 1,
                    max_page,
                    start,
                    end,
                    per_page,
                    data,
                    interaction: i
                });

                page--;
            } else if (i.customId === 'auto_page.previous_10') {
                this.emitter.emit('collect', {
                    _transaction: 'previous_10',
                    page: page - 10,
                    max_page,
                    start,
                    end,
                    per_page,
                    data,
                    interaction: i
                });

                page -= 10;
            } else if (i.customId === 'auto_page.next') {
                this.emitter.emit('collect', {
                    _transaction: 'next',
                    page: page + 1,
                    max_page,
                    start,
                    end,
                    per_page,
                    data,
                    interaction: i
                });

                page++;
            } else if (i.customId === 'auto_page.next_10') {
                this.emitter.emit('collect', {
                    _transaction: 'next_10',
                    page: page + 10,
                    max_page,
                    start,
                    end,
                    per_page,
                    data,
                    interaction: i
                });

                page += 10;
            };

            await (i.message as Message).edit({
                embeds: [
                    await generate_embed()
                ],
                components: [
                    ...(components ?? []),
                    await generate_components()
                ]
            }).catch(() => { });
        });

        return msg;
    };

    public on(event: 'collect', listener: (...args: any[]) => void) {
        this.emitter.on(event, listener);
        return this;
    };

    public changeData(data: any[]) {
        this.data = data;
        return this;
    };
};