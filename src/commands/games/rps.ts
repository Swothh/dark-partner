import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { Commands } from '../../structures';
import { nanoid } from 'nanoid';
import { User } from '../../models';
import { Captcha } from '../../utils';

export const Command: Commands = {
    name: 'tkm',
    description: 'Taş kağıt makas.',
    aliases: ['rps'],
    category: 'games',
    cooldown: 5000,
    requireds: {
        vote: true
    },
    run: async (client, message, args, locale) => {
        const user = await User.findOne({ user: message.author.id }).select('amount').lean();

        let bet = 5;
        if (!user || user.amount < bet) return message.error(locale('commands.roulette.noMoney', {
            amount: String(bet)
        }));

        const ids = [
            'rock',
            'paper',
            'scissors',
            'leave'
        ].reduce((obj, key) => {
            obj[key] = nanoid();
            return obj;
        }, {} as Record<string, string>);

        const getEmbeds = () => [
            new EmbedBuilder()
                .setTitle(locale('commands.rps.title'))
                .setColor(client.config.colors.main)
                .addFields({
                    name: locale('commands.rps.you'),
                    value: client.config.emojis.roulette.unknown,
                    inline: true
                }, {
                    name: locale('commands.rps.bot'),
                    value: client.config.emojis.roulette.unknown,
                    inline: true
                })
                .setFooter({ text: locale('commands.rps.footer'), iconURL: client.config.icons.info_2 })
                .setTimestamp()
        ];

        const getComps = (d?: boolean) => [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(ids.rock)
                        .setEmoji(client.config.emojis.rock)
                        .setDisabled(d)
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId(ids.paper)
                        .setEmoji(client.config.emojis.paper)
                        .setDisabled(d)
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId(ids.scissors)
                        .setEmoji(client.config.emojis.scissors)
                        .setDisabled(d)
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId(ids.leave)
                        .setEmoji(client.config.emojis.remove)
                        .setDisabled(d)
                        .setStyle(ButtonStyle.Danger)
                )
        ];

        const msg = await message.nmReply({
            embeds: getEmbeds(),
            components: getComps(false)
        });

        const collector = client.managers.Collector({
            msg,
            channel: message.channel,
            componentType: ComponentType.Button,
            filter: i => i.user.id === message.author.id && i.message.id === msg.id,
            time: 60000
        });

        collector.on('collect', async i => {
            if (!i.isButton()) return;

            const choice = i.customId;
            const choice_emoji = choice === ids.rock ? client.config.emojis.rock : choice === ids.paper ? client.config.emojis.paper : client.config.emojis.scissors;

            const random = Math.floor(Math.random() * 3) + 1;
            const result = random === 1 ? 'draw' : random === 2 ? 'lose' : 'win';

            await i.deferUpdate();

            if (i.customId === ids.leave) {
                collector.stop();
                await i.message.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(locale('commands.rps.title'))
                            .setColor(client.config.colors.main)
                            .addFields({
                                name: locale('commands.rps.you'),
                                value: client.config.emojis.roulette.unknown + ' ' + locale('commands.rps.leave'),
                                inline: true
                            }, {
                                name: locale('commands.rps.bot'),
                                value: client.config.emojis.sad,
                                inline: true
                            })
                            .setFooter({ text: locale('commands.rps.footer_leave'), iconURL: client.config.icons.warning })
                            .setTimestamp()
                    ],
                    components: getComps(true)
                });

                return;
            };

            let bot_choice: any;
            if (result === 'draw') bot_choice = choice_emoji;
            if (result === 'win') {
                if (choice === ids.rock) bot_choice = client.config.emojis.scissors;
                if (choice === ids.paper) bot_choice = client.config.emojis.rock;
                if (choice === ids.scissors) bot_choice = client.config.emojis.paper;
            } else if (result === 'lose') {
                if (choice === ids.rock) bot_choice = client.config.emojis.paper;
                if (choice === ids.paper) bot_choice = client.config.emojis.scissors;
                if (choice === ids.scissors) bot_choice = client.config.emojis.rock;
            };

            if (result === 'draw') {
                collector.stop();
                await i.message.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(locale('commands.rps.title'))
                            .setColor(client.config.colors.main)
                            .addFields({
                                name: locale('commands.rps.you'),
                                value: choice_emoji + ' ' + locale('commands.rps.draw'),
                                inline: true
                            }, {
                                name: locale('commands.rps.bot'),
                                value: bot_choice + ' ' + locale('commands.rps.draw'),
                                inline: true
                            })
                            .setFooter({ text: locale('commands.rps.footer_draw'), iconURL: client.config.icons.info_2 })
                            .setTimestamp()
                    ],
                    components: getComps(true)
                });

                return;
            };

            if (result === 'win') {
                collector.stop();
                await i.message.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(locale('commands.rps.title'))
                            .setColor(client.config.colors.main)
                            .addFields({
                                name: locale('commands.rps.you'),
                                value: choice_emoji + ' ' + locale('commands.rps.win'),
                                inline: true
                            }, {
                                name: locale('commands.rps.bot'),
                                value: bot_choice + ' ' + locale('commands.rps.lose'),
                                inline: true
                            })
                            .setFooter({ text: locale('commands.rps.footer_win'), iconURL: client.config.icons.info_2 })
                            .setTimestamp()
                    ],
                    components: getComps(true)
                });

                await User.updateOne({ user: message.author.id }, {
                    $inc: {
                        'amount': bet
                    },
                    $push: {
                        history: {
                            reason: 'rps',
                            amount: bet,
                            staff: 'System',
                            date: Date.now()
                        }
                    }
                }, { upsert: true });

                return;
            };

            if (result === 'lose') {
                collector.stop();
                await i.message.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(locale('commands.rps.title'))
                            .setColor(client.config.colors.main)
                            .addFields({
                                name: locale('commands.rps.you'),
                                value: choice_emoji + ' ' + locale('commands.rps.lose'),
                                inline: true
                            }, {
                                name: locale('commands.rps.bot'),
                                value: bot_choice + ' ' + locale('commands.rps.win'),
                                inline: true
                            })
                            .setFooter({ text: locale('commands.rps.footer_lose'), iconURL: client.config.icons.info_2 })
                            .setTimestamp()
                    ],
                    components: getComps(true)
                });

                await User.updateOne({ user: message.author.id }, {
                    $inc: {
                        'amount': -bet
                    },
                    $push: {
                        history: {
                            reason: 'rps',
                            amount: -bet,
                            staff: 'System',
                            date: Date.now()
                        }
                    }
                }, { upsert: true });
                return;
            };
        });
    }
};