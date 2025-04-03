import { Commands } from '../../structures';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } from 'discord.js';
import { Guild } from '../../models';

export const Command: Commands = {
    name: 'guild-case',
    description: 'server case',
    aliases: ['sk', 'sunucu-kasası', 'sunucukasa', 'kazanç', 'kazançlar', 'guildcase', 'gc', 'sunucu-kasa'],
    category: 'user',
    cooldown: 5000,
    requireds: {
        owner: true
    },
    run: async (client, message, args, locale) => {
        const db = await Guild.findOne({ guildId: message.guild.id }, { vault: true });

        await message.nmReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.colors.main)
                    .setAuthor({ name: locale('commands.guild_case.author', { guild: message.guild.name }), iconURL: message.guild.iconURL() })
                    .setThumbnail(client.config.icons.guild_case_2)
                    .addFields({
                        name: locale('commands.guild_case.fields.1.name'),
                        value: locale('commands.guild_case.fields.1.value', { total: (db?.vault?.total ?? 0).toLocaleString() }),
                        inline: true
                    }, {
                        name: locale('commands.guild_case.fields.2.name'),
                        value: locale('commands.guild_case.fields.2.value', { total_staff: '10' }),
                        inline: true
                    }, {
                        name: locale('commands.guild_case.fields.4.name'),
                        value: 'sa'
                    })
            ]
        })
    }
};