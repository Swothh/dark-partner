import { Commands } from '../../structures';
import { User } from '../../models'

export const Command: Commands = {
    name: 'blacklist',
    description: 'Add Blacklist',
    aliases: ['karaliste'],
    category: 'developers',
    cooldown: 5000,
    requireds: {
        owner: true
    },
    run: async (client, message, args, locale) => {
        const [t, id] = args;
        const reason = args.slice(2).join(' ');
        const transactions = ['add', 'remove', 'ekle', 'kaldır', 'sil', '+', '-'];

        if (!transactions.includes(t)) return message.error('Please specify a transaction type. (add/remove)');
        if (!id) return message.error('Please specify a user id.');

        const user = await client.shardManager.eval('GET_USER', { user: id });
        if (!user) return message.error('User not found.');

        const find = await User.findOne({ user: user.data.id }, { banned: true });

        if (t === 'add' || t === 'ekle' || t === '+') {
            if (!reason) return message.error('Please specify a reason.');
            if (find?.banned?.ban === true) return message.error('User already banned.');

            await User.updateOne({ user: user?.data?.id }, {
                banned: {
                    ban: true,
                    reason: reason
                }
            }, { upsert: true });
            return message.success('User added to the blacklist.');
        } else if (t === 'remove' || t === 'kaldır' || t === 'sil' || t === '-') {
            if (find?.banned?.ban !== true) return message.error('User not banned.');

            await User.updateOne({ user: user?.data?.id }, {
                banned: {
                    ban: false,
                    reason: null,
                    date: null
                }
            }, { upsert: true });

            return message.success('User removed from the blacklist.');
        };
    }
};