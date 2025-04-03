import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Commands } from '../../structures';

export const Command: Commands = {
    name: 'coin-d',
    description: 'coineklion.',
    aliases: ['coind', 'cd'],
    category: 'staff',
    requireds: {
        owner: true
    },
    cooldown: 10000,
    run: async (client, message, args, locale) => {
        const transaction = args[0];
        const user = message.mentions.users.first() || args[1];
    }
};