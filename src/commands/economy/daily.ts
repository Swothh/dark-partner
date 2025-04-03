import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { Commands } from '../../structures';
import { User } from '../../models';
import { Tasks } from '../../managers';

export const Command: Commands = {
    name: 'daily',
    description: 'Günlük.',
    aliases: ['günlük', 'gunluk'],
    category: 'economy',
    cooldown: 5000,
    run: async (client, message, args, locale) => {
        const waiting = await User.findOne({ user: message.author.id }).select('daily').lean();
        const ms = 1000 * 60 * 60 * 24;
        const remain = ms - (Date.now() - (waiting?.daily || 0));

        if (remain === 0 || remain < 0) {
            const random = Math.floor(Math.random() * 5) + 1;

            await User.updateOne({ user: message.author.id }, {
                $inc: {
                    amount: random
                },
                $set: {
                    daily: Date.now()
                },
                $push: {
                    history: {
                        reason: 'daily',
                        amount: random,
                        staff: 'System',
                        date: Date.now()
                    }
                }
            }, { upsert: true });
            await message.success(locale('commands.daily.success', { amount: String(random) }));

            const task = new Tasks();
            await task.update(message.author.id, 'daily', 1).then(d => {
                if (d.finished) {
                    message.sendTask('daily', d.difficulty, d.prize);
                };
            });
        } else {
            const txt = `<t:${Math.floor(Date.now() / 1000 + remain / 1000)}:R>`;
            return message.error(locale('commands.daily.waiting', { time: txt }));
        };
    }
};