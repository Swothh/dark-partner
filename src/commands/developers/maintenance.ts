import { EmbedBuilder, PresenceData, ActivityType } from 'discord.js';
import { Commands } from '../../structures';
import { Global } from '../../models';
import Dark from '../../client';

export const Command: Commands = {
    name: 'bakım',
    description: 'res',
    aliases: ['maintenance', 'bakim'],
    category: 'developers',
    cooldown: 5000,
    requireds: {
        owner: true
    },
    run: async (client, message, args, locale) => {
        const global = await Global.findOne({ globalId: 'global' });
        if (global.maintenance) {
            await Global.updateOne({ globalId: 'global' }, { maintenance: null });
            return message.success('Success, maintenance mode is disabled.')
        } else {
            const reason = args.join(' ') ?? locale('events.maintenance.defaultReason');
            await Global.updateOne({ globalId: 'global' }, { maintenance: reason });
            return message.success('Success, maintenance mode is enabled. Reason: ' + reason)
        };
    }
};