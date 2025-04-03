import { User } from '../../models';
import { HangMan } from '../../lib';
import { Commands } from '../../structures';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType } from 'discord.js';


export const Command: Commands = {
    name: 'ht',
    description: 'hızlı tıklıon.',
    aliases: ['fc', 'fast-click', 'fastclick', 'hızlı-tıkla', 'hızlıtıkla', 'hizli-tikla', 'hizlitikla'],
    category: 'games',
    cooldown: 300000,
    requireds: {
        vote: true
    },
    run: async (client, message, args, locale) => {
        const random = Math.floor(Math.random() * 16);
        const items = ['📍', '✏️', '📦', '📧', '🍨', '🍐', '🍏', '🍎', '🍊', '🍋', '🍇', '🍉', '🍓', '👁', '👀', '👅', '🧠', '🫀', '🌞', '🌚', '🍷'];
        const randomItems = Array.from({ length: 4 }).map(() => items[Math.floor(Math.random() * items.length)]);

        let f: boolean = false;
        const fixedEmojiRows: string[][] = [];

        for (let i = 0; i < 5; i++) {
            const emojiRow: string[] = [];

            for (let j = 0; j < 4; j++) {
                const isRandom = random - (4 * i) === j;
                emojiRow.push(isRandom ? randomItems[i] : items[Math.floor(Math.random() * items.length)]);
            };

            fixedEmojiRows.push(emojiRow);
        };

        const getComponents = (d?: boolean) => fixedEmojiRows.map((emojiRow, i) => (
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    ...emojiRow.map((emoji, index) => (
                        new ButtonBuilder()
                            .setEmoji(emoji)
                            .setDisabled(d ? true : f ? true : random - (4 * i) === index ? false : true)
                            .setStyle(f ? random - (4 * i) === index ? ButtonStyle.Success : ButtonStyle.Secondary : ButtonStyle.Secondary)
                            .setCustomId(`click-${(i * 4 + index)}`)
                    ))
                )
        ));

        const msg = await message.channel.send({
            content: locale('commands.fastclick.content'),
            components: getComponents()
        });

        const collector = client.managers.Collector({
            msg,
            channel: message.channel,
            componentType: ComponentType.Button,
            filter: i => i.user.id === message.author.id && i.message.id === msg.id,
            time: 60000
        });

        const $ = Date.now();
        collector.on('collect', async (i) => {
            const past = Date.now() - $;
            const get = () => {
                if (past < 1000) {
                    return 4;
                } else if (past < 1500) {
                    return 3;
                } else if (past < 2000) {
                    return 1.5;
                } else if (past < 2500) {
                    return 0.8;
                } else if (past < 3000) {
                    return 0.5;
                } else {
                    return 0;
                };
            };

            const coin = get();
            await i.deferUpdate().catch(() => { });

            f = true;

            await i.message.edit({
                components: getComponents(true)
            });

            if (coin !== 0) {
                await User.updateOne({ user: message.author.id }, {
                    $inc: {
                        'amount': coin
                    },
                    $push: {
                        history: {
                            reason: 'fast-click',
                            amount: coin,
                            staff: 'System',
                            date: Date.now()
                        }
                    }
                }, { upsert: true });

                await i.message.edit({
                    content: locale('commands.fastclick.win_content', {
                        amount: String(coin)
                    }),
                    components: getComponents()
                });
            } else {
                await i.message.edit({
                    content: locale('commands.fastclick.lose_content'),
                    components: getComponents()
                });
            };

            collector.stop();
        });

        collector.on('end', async (_, __) => {
            if (__ === 'time') {
                if (f) return;

                await msg.edit({
                    content: locale('commands.fastclick.time_content'),
                    components: getComponents()
                });
            };
        });


    }
};