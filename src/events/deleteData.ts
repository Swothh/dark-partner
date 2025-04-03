import { Guild } from 'discord.js';
import { Events } from '../structures';
import { Guild as GuildModel } from '../models';

export const Event: Events = {
    name: 'guildDelete',
    on: 'on',
    run: async (client, g: Guild) => {
        try {
            await GuildModel.deleteOne({ guildId: g.id });
        } catch (err) {
            console.error(err);
        };
    }
};