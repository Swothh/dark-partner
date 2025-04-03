import { User } from '../../models';
import { HangMan } from '../../lib';
import { Commands } from '../../structures';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType } from 'discord.js';
import { Tasks } from '../../managers';

export const Command: Commands = {
    name: 'cf',
    description: 'coinflip',
    aliases: ['coinflip', 'yt', 'yazı-tura', 'yazıtura', 'coin-flip'],
    category: 'games',
    cooldown: 10000,
    run: async (client, message, args, locale) => {
        const user = await User.findOne({ user: message.author.id });

        let [bet, choice] = args;
        let result: string;

        if (!bet) return message.error(locale('commands.cf.noBet'));
        if (Number(bet) < 1) return message.error(locale('commands.cf.noBet'));
        if (isNaN(Number(bet))) return message.error(locale('commands.cf.noBet'));

        if (Number(bet) % 1 !== 0) return message.error(locale('commands.cf.noBet'));
        if (Number(bet) > (user?.amount ?? 0)) return message.error(locale('commands.cf.noMoney'));
        if (Number(bet) > client.config.limits.cf_max) return message.error(locale('commands.cf.maxBet', { amount: String(client.config.limits.cf_max) }));

        if (choice?.toLowerCase() === locale('commands.cf.heads').toLowerCase() || locale('commands.cf.heads').toLowerCase().charAt(0) === choice?.toLowerCase()) {
            choice = 'heads';
        } else {
            choice = 'tails';
        };

        const start = locale('commands.cf.start', { amount: String(bet), choice: locale(`commands.cf.${choice}`), user: message.author.id });
        const msg = await message.channel.send({
            content: start
        });

        const random = Math.floor(Math.random() * 9);
        if (random === 0) result = 'lose';
        else if ([1, 2, 3, 6].includes(random) && choice === 'heads') result = 'lose';
        else if ([4, 5, 7, 8].includes(random) && choice === 'tails') result = 'lose';
        else result = 'win';

        setTimeout(async () => {
            const txt = locale(`commands.cf.${result}`, { amount: String(bet), choice: locale(`commands.cf.${choice}`), user: message.author.id });
            await msg.edit({
                content: txt
            });

            await User.updateOne({ user: message.author.id }, {
                $inc: {
                    amount: result === 'win' ? Number(bet) : -Number(bet)
                },
                $push: {
                    history: {
                        reason: 'cf',
                        amount: result === 'win' ? Number(bet) : -Number(bet),
                        staff: 'System',
                        date: Date.now()
                    }
                }
            }, {
                upsert: true
            });

            const task = new Tasks();
            await task.update(message.author.id, 'be_the_bad_guy', 1).then(d => {
                if (d.finished) {
                    message.sendTask('be_the_bad_guy', d.difficulty, d.prize);
                };
            });
        }, 3000);
    }
};