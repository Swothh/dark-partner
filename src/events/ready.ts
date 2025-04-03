import { ActivityType } from 'discord.js';
import { Events } from '../structures';

export const Event: Events = {
    name: 'ready',
    on: 'on',
    run: async (client) => {
        try {
            if (client.config.main.__whitelist?.enabled && client.user.id !== client.config.main.__whitelist?.bot_id) client.shard.send('invalid_test_bot');
        } catch (err) {
            console.error(err);
        };
    }
};