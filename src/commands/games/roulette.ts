import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { Commands } from '../../structures';
import { nanoid } from 'nanoid';
import { User } from '../../models';
import { Captcha } from '../../utils';
import { Tasks } from '../../managers';

export const Command: Commands = {
    name: 'rulet',
    description: 'Rulet oynayarak bahsini katla.',
    aliases: ['roulette'],
    category: 'games',
    cooldown: 100000,
    run: async (client, message, args, locale) => {
        const user = await User.findOne({ user: message.author.id }).select('amount').lean();
        if (!user || user.amount < 20) return message.error(locale('commands.roulette.noMoney', {
            amount: String(20)
        }));

        //await Captcha(client, message, args, locale);

        const bullet = Math.floor(Math.random() * 6) + 1;
        let died = false, pulled = 0;

        const bet = 20;
        const multiplers = [0.5, 1.1, 1.7, 2.3, 2.9];

        await User.updateOne({ user: message.author.id }, {
            $inc: {
                'amount': -bet
            },
            $push: {
                history: {
                    reason: 'roulette',
                    amount: -bet,
                    staff: 'System',
                    date: Date.now()
                }
            }
        }, { upsert: true });

        const ids = [
            'continue',
            'leave'
        ].reduce((obj, key) => {
            obj[key] = nanoid();
            return obj;
        }, {} as Record<string, string>);

        const getEmbeds = () => [
            new EmbedBuilder()
                .setTitle(locale('commands.roulette.title'))
                .setColor(pulled === 0 ? client.config.colors.main : died ? 'Red' : client.config.colors.main)
                .setDescription('# ' + client.config.emojis.roulette[died ? 'dead' : 'alive'] + client.config.emojis.roulette.gun)
                .addFields({
                    name: locale('commands.roulette.bet'),
                    value: `${bet.toLocaleString()} ${client.config.emojis.coin} ${client.config.emojis.blank}`,
                    inline: true
                }, {
                    name: locale('commands.roulette.now'),
                    value: `(${died ? 0 : (multiplers[pulled - 1] || 0)}x) ${died ? 0 : (bet * (multiplers[pulled - 1] || 0)).toLocaleString()} ${client.config.emojis.coin} ${client.config.emojis.blank}`,
                    inline: true
                }, {
                    name: locale('commands.roulette.bullet'),
                    value: client.config.emojis.roulette.known.repeat(pulled - (died ? 1 : 0)) + (died ? client.config.emojis.roulette.bullet : '') + client.config.emojis.roulette.unknown.repeat(6 - pulled),
                    inline: true
                })
        ];

        const getComps = () => [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(ids.continue)
                        .setEmoji(client.config.emojis.roulette.gun)
                        .setDisabled(died)
                        .setLabel(locale('commands.roulette.pull'))
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId(ids.leave)
                        .setEmoji(pulled === 0 ? '❌' : client.config.emojis.coin.match(/[0-9]+/)?.[0])
                        .setDisabled(died)
                        .setLabel(pulled === 0 ? locale('commands.roulette.leave') : locale('commands.roulette.collect'))
                        .setStyle(ButtonStyle.Secondary)
                )
        ];

        const msg = await message.nmReply({
            embeds: getEmbeds(),
            components: getComps()
        });

        const task = new Tasks();
        await task.update(message.author.id, 'be_the_bad_guy', 1).then(d => {
            if (d.finished) {
                message.sendTask('be_the_bad_guy', d.difficulty, d.prize);
            };
        });

        const collector = client.managers.Collector({
            msg,
            channel: message.channel,
            componentType: ComponentType.Button,
            filter: i => i.user.id === message.author.id && i.message.id === msg.id,
            time: 60000
        });

        /*collector.on('end', () => {
            message.channel.send('bitti');
        });*/ // buglu bu amg 2x felan çalışıyo en iyisi setTimeout

        collector.on('collect', async i => {
            collector.resetTimer();
            i.deferUpdate();

            if (!died) {
                if (i.customId === ids.continue) {
                    pulled++;
                    if (pulled === bullet) died = true;

                } else if (i.customId === ids.leave) {
                    if (pulled === 0 || died) {
                        await User.updateOne({ user: message.author.id }, {
                            $inc: {
                                'amount': bet
                            },
                            $push: {
                                history: {
                                    reason: 'roulette',
                                    amount: bet,
                                    staff: 'System',
                                    date: Date.now()
                                }
                            }
                        }, { upsert: true });

                        return collector.stop();
                    };

                    collector.stop();
                    await User.updateOne({ user: message.author.id }, {
                        $inc: {
                            'amount': (bet * (multiplers[pulled - 1] || 0))
                        },
                        $push: {
                            history: {
                                reason: 'roulette',
                                amount: (bet * (multiplers[pulled - 1] || 0)),
                                staff: 'System',
                                date: Date.now()
                            }
                        }
                    }, { upsert: true });
                };
            };

            msg.edit({
                embeds: getEmbeds(),
                ...(i.customId === ids.leave ? {} : {
                    components: getComps()
                })
            });
        });
    }
};