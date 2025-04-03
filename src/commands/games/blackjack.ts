import { User } from '../../models';
import { Commands } from '../../structures';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType } from 'discord.js';
import { Blackjack, IDeckCard, GetValue } from 'easy-blackjack';
import { Tasks } from '../../managers';

export const Command: Commands = {
    name: 'bj',
    description: 'blackjack',
    aliases: ['blackjack', '21'],
    category: 'games',
    cooldown: 10000,
    run: async (client, message, args, locale) => {
        const [bet] = args;

        if (client.bjGames.has(message.author.id)) return await message.error(locale('commands.bj.active_game'));
        if (!bet || isNaN(Number(bet))) return await message.error(locale('commands.bj.no_bet'));

        const parsed = Number(bet);
        if (parsed < 1) return await message.error(locale('commands.bj.min_bet', { amount: "1" }));
        if (parsed > 50) return await message.error(locale('commands.bj.max_bet', { amount: "50" }));
        if (Math.round(parsed) !== parsed) return await message.error(locale('commands.bj.no_bet'));

        const user = await User.findOne({ user: message.author.id }, { amount: 1 });
        if (parsed > (user?.amount ?? 0)) return await message.error(locale('commands.bj.no_money'));

        await User.updateOne({ user: message.author.id }, {
            $inc: {
                amount: -parsed
            },
            $push: {
                history: {
                    reason: 'bj',
                    amount: -parsed,
                    staff: 'System',
                    date: Date.now()
                }
            }
        }, { upsert: true });

        const cardsCache: IDeckCard[] = [];
        const game = new Blackjack();
        const gameId = Math.random().toString(36).substring(2);
        client.bjGames.set(message.author.id, gameId);

        const getEmoji = (card: IDeckCard) => {
            const inCache = cardsCache.find(c => c === card);

            const el = client.config.cards.find(c => (
                c.value === card.value.toLowerCase() &&
                c.type === card.type.toLowerCase() &&
                c.flip === (inCache ? false : true)
            ));

            if (!inCache) cardsCache.push(card);
            return el.emoji;
        };

        const getResult = () => {
            switch (game.result) {
                case 'BOTH_BUST':
                    return locale('commands.bj.both_bust');
                case 'DEALER_WINS':
                    return locale('commands.bj.dealer_wins', { bet: parsed.toString() });
                case 'PLAYER_WINS':
                    return locale('commands.bj.player_wins', { bet: parsed.toString(), player: message.author.displayName });
                case 'TIE':
                    return locale('commands.bj.tie');
                default:
                    return locale('commands.bj.continues');
            };
        };

        const getEmbed = () => {
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.main)
                .setAuthor({ name: locale('commands.bj.author', { author: message.author.displayName }), iconURL: message.author.displayAvatarURL() })
                .addFields(
                    (game.result ? {
                        name: '' + locale('commands.bj.dealer') + '*(' + game.dealerSum + ')*',
                        value: game.dealerDeck.filter(c => c !== game.hidden).map(getEmoji).join(' ') + ' ' + getEmoji(game.hidden),
                        inline: true
                    } : {
                        name: '' + locale('commands.bj.dealer') + '*(' + (game.dealerSum - GetValue(game.hidden)) + '+?)*',
                        value: game.dealerDeck.filter(c => c !== game.hidden).map(getEmoji).join(' ') + ' ' + client.config.cards.find(c => c.value === 'back').emoji,
                        inline: true
                    }),
                    {
                        name: message.author.displayName + '*(' + game.playerSum + ')*',
                        value: game.playerDeck.map(getEmoji).join(' '),
                        inline: true
                    }
                );

            embed.setDescription(getResult());
            return embed;
        };

        const getActions = (isDisabled?: boolean) => {
            const disable = isDisabled || typeof game.result !== 'undefined';

            return new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`HIT`)
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('👊')
                        .setDisabled(disable ? true : false),
                    new ButtonBuilder()
                        .setCustomId(`STAND`)
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('✋')
                        .setDisabled(disable ? true : false)
                );
        };

        const msg = await message.nmReply({
            embeds: [
                getEmbed()
            ],
            components: [
                getActions()
            ]
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
            time: 1000 * 60 * 3
        });

        collector.on('end', () => {
            if (!client.bjGames.has(message.author.id)) return;
            client.bjGames.delete(message.author.id);
        });

        collector.on('collect', async i => {
            if (i.customId === 'HIT') {
                game.hit();
            } else {
                game.stay();
            };

            if (game.result) {
                client.bjGames.delete(message.author.id);
                if (game.result === 'PLAYER_WINS') {
                    await User.updateOne({ user: message.author.id }, {
                        $inc: {
                            amount: parsed * 2
                        },
                        $push: {
                            history: {
                                reason: 'bj',
                                amount: parsed * 2,
                                staff: 'System',
                                date: Date.now()
                            }
                        }
                    }, { upsert: true });
                } else if (game.result === 'TIE') {
                    await User.updateOne({ user: message.author.id }, {
                        $inc: {
                            amount: parsed
                        },
                        $push: {
                            history: {
                                reason: 'bj',
                                amount: parsed,
                                staff: 'System',
                                date: Date.now()
                            }
                        }
                    }, { upsert: true });
                };
            };

            await msg.edit({
                embeds: [
                    getEmbed()
                ],
                components: [
                    getActions()
                ]
            }).catch(() => {
                client.bjGames.delete(message.author.id);
            });

            await i.deferUpdate().catch(() => {
                client.bjGames.delete(message.author.id);
            });
        });
    }
};