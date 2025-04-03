import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, StringSelectMenuBuilder } from 'discord.js';
import { Commands } from '../structures';
import { Guild } from '../models';

export const Command: Commands = {
    name: 'gift',
    description: 'hediye al.',
    aliases: ['hediye'],
    category: 'bot',
    cooldown: 5000,
    requireds: {
        owner: true
    },
    run: async (client, message, args, locale) => {
        await Guild.updateOne({ guildId: message.guild.id }, { $inc: { 'subscriptions.partner_random': 50 } }, { upsert: true });
        await message.channel.send('Hediye alındı: **50 Partner Rastgele**.')
    }
};