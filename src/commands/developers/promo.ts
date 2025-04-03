import { Commands } from '../../structures';
import { Code, User, Guild } from '../../models';
import { EmbedBuilder } from 'discord.js';

export const Command: Commands = {
    name: 'promo',
    description: 'Promo add',
    aliases: [],
    category: 'developers',
    cooldown: 5000,
    requireds: {
        owner: false
    },
    run: async (client, message, args, locale) => {
        if (client.config.main.owners.includes(message.author.id) && !message.content.includes('--force')) {
            const [t] = args;
            if (!t) return message.error('Please enter a transaction. (add, remove, info)');

            if (t === 'add') {
                const types = ['coin', 'random'];
                let [type, amount, max_usage, code] = args.slice(1);

                if (!type || !types.includes(type)) return message.error('Please enter a type. (coin, random)');
                if (!amount) return message.error('Please enter a amount.');
                if (isNaN(Number(amount))) return message.error('Please enter a valid amount.');
                if (!max_usage) return message.error('Please enter a max usage.');

                if (code) {
                    const checker = await Code.findOne({ code });
                    if (checker) return message.error('This code already exists.');
                };

                code = code ?? `DP_${type === 'coin' ? 'U_COIN' : 'G_RANDOM'}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
                new Code({
                    code,
                    type,
                    amount,
                    usage: max_usage
                }).save();

                message.success('Code successfully created. `(code: ' + code + ', type: ' + type + ', amount: ' + amount + ')`');
            } else if (t === 'remove') {
                const [code] = args.slice(1);

                if (!code) return message.error('Please enter a code.');

                const checker = await Code.findOne({ code });
                if (!checker) return message.error('This code does not exist.');

                await Code.deleteOne({ code });

                message.success('Code successfully deleted. `(code: ' + code + ', type: ' + checker.type + ', amount: ' + checker.amount + ', usage: ' + checker.usage + ', totalUsage: ' + checker.totalUsage + ')`');
            } else if (t === 'info') {
                const [code] = args.slice(1);

                if (!code) return message.error('Please enter a code.');

                const checker = await Code.findOne({ code });
                if (!checker) return message.error('This code does not exist.');

                message.success('Code information. `(code: ' + checker.code + ', type: ' + checker.type + ', amount: ' + checker.amount + ', usage: ' + checker.usage + ', totalUsage: ' + checker.totalUsage + ')`');
            };
        } else {
            const [code] = args;
            if (!code) return message.error(locale('commands.promo.enter_code'));

            const check = await Code.findOne({ code });
            if (!check) return message.error(locale('commands.promo.not_found'));

            const type = check.type;
            if (type === 'coin') {
                if (check.totalUsage >= check.usage) return message.error(locale('commands.promo.max_use'));
                if (check.users.includes(message.author.id)) return message.error(locale('commands.promo.already_used'));

                await Promise.all([
                    Code.updateOne({ code }, { $inc: { totalUsage: 1 }, $push: { users: message.author.id } }, { upsert: true }),
                    User.updateOne({ user: message.author.id }, {
                        $inc: {
                            'amount': check.amount
                        },
                        $push: {
                            history: {
                                reason: 'promo',
                                amount: check.amount,
                                staff: 'System',
                                date: Date.now()
                            }
                        }
                    }, { upsert: true })
                ]);

                await message.nmReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.config.colors.success)
                            .setAuthor({ name: locale('commands.promo.success_coin_author', { user: message.author.displayName }), iconURL: message.author.avatarURL() })
                            .setTitle(locale('commands.promo.success_coin_title'))
                            .setDescription(locale('commands.promo.success_coin_desc', { code: check.code, amount: String(check.amount) }))
                            .setFooter({ text: locale('commands.promo.success_coin_footer'), iconURL: client.config.icons.info })
                            .setTimestamp()
                    ]
                });
            } else if (type === 'random') {
                const p = message.member.permissions.has('ManageGuild');

                if (!p) return message.error(locale('commands.promo.perm_error'));
                if (check.totalUsage >= check.usage) return message.error(locale('commands.promo.max_use'));
                if (check.users.includes(message.guild.id)) return message.error(locale('commands.promo.already_used'));

                await Code.updateOne({ code }, { $inc: { totalUsage: 1 }, $push: { users: message.guild.id } }, { upsert: true });
                await Guild.updateOne({ guildId: message.guild.id }, { $inc: { 'subscriptions.partner_random': check.amount } }, { upsert: true });

                await message.nmReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.config.colors.success)
                            .setAuthor({ name: locale('commands.promo.success_coin_author', { user: message.author.displayName }), iconURL: message.author.avatarURL() })
                            .setTitle(locale('commands.promo.success_coin_title'))
                            .setDescription(locale('commands.promo.success_random_desc', { code: check.code, amount: String(check.amount) }))
                            .setFooter({ text: locale('commands.promo.success_random_footer'), iconURL: client.config.icons.info })
                            .setTimestamp()
                    ]
                });
            };
        };
    }
};