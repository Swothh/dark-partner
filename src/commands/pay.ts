import { WebhookClient } from 'discord.js';
import { Commands } from '../structures';
import { User } from '../models';
import { Tasks } from '../managers';

export const Command: Commands = {
    name: 'pay',
    description: 'Para gönderir',
    aliases: ['send', 'gönder'],
    category: 'economy',
    cooldown: 5000,
    run: async (client, message, args, locale) => {
        const user = message.mentions.users.first();
        const amount = Number(Number(args[1]).toFixed(1));
        if (!user) return message.error(locale('commands.pay.noUser'));

        const db = await User.findOne({ user: message.author.id });

        if (!amount) return message.error(locale('commands.pay.noAmount'));
        if (amount < client.config.limits.pay_min) return message.error(locale('commands.pay.minAmount', { amount: String(client.config.limits.pay_min) }));
        if (isNaN(amount)) return message.error(locale('commands.pay.noAmount'));
        if (amount % 1 !== 0) return message.error(locale('commands.pay.noAmount'));

        if (user.id === message.author.id) return message.error(locale('commands.pay.self'));
        if (user.bot) return message.error(locale('commands.pay.noBot'));

        if (amount > (db?.amount ?? 0)) return message.error(locale('commands.pay.noMoney'));
        if (amount > client.config.limits.pay_max) return message.error(locale('commands.pay.maxAmount', { amount: String(client.config.limits.pay_max) }));

        await Promise.all([
            User.updateOne({ user: message.author.id }, {
                $inc: {
                    'amount': -amount
                },
                $push: {
                    history: {
                        reason: 'pay',
                        amount: -amount,
                        staff: 'System',
                        date: Date.now()
                    }
                }
            }, { upsert: true }),
            User.updateOne({ user: user.id }, {
                $inc: {
                    'amount': amount
                },
                $push: {
                    history: {
                        reason: 'pay',
                        amount: amount,
                        staff: 'System',
                        date: Date.now()
                    }
                }
            }, { upsert: true })
        ]);

        await message.success(locale('commands.pay.success', { amount: String(amount), user: user.id }));

        const task = new Tasks();
        await task.update(message.author.id, 'generosity', 1).then(d => {
            if (d.finished) {
                message.sendTask('generosity', d.difficulty, d.prize);
            };
        });

        const webhook = new WebhookClient(client.config.webhooks.pay);
        await webhook.send({
            content: `**${message.author.tag}** (<@${message.author.id}> \`${message.author.id}\`) adlı kullanıcı **${user.tag}** (<@${user.id}> \`${user.id}\`) adlı kullanıcıya **${amount}** coin gönderdi.`
        });
    }
};