import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { Commands } from '../../structures';
import { User } from '../../models';

export const Command: Commands = {
    name: 'promo',
    description: 'Promo.',
    aliases: ['promotion', 'promote', 'promos', 'promotions', 'promotes', 'kod'],
    category: 'economy',
    cooldown: 5000,
    run: async (client, message, args, locale) => {

    }
};