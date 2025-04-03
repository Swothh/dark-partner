import { EmbedBuilder } from 'discord.js';
import { Commands } from '../structures';

export const Command: Commands = {
    name: 'ping',
    description: 'Gecikme süresini gösterir',
    aliases: ['gecikme'],
    category: 'bot',
    cooldown: 5000,
    run: async (client, message, args, locale) => {
        await message.nmReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.colors.main)
                    .setDescription(locale('commands.ping.msg', {
                        ping: String(client.ws.ping)
                    }))
            ]
        }).catch(() => { });
    }
};