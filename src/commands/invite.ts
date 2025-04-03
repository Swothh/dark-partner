import { Commands } from '../structures';
import { Global } from '../models';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';

export const Command: Commands = {
    name: 'invite',
    description: 'botu davet edion',
    aliases: ['davet'],
    category: 'bot',
    cooldown: 5000,
    run: async (client, message, args, locale) => {
        const all_guilds = client.collectionGuilds.get('database_guild');

        await message.nmReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.colors.main)
                    .setAuthor({ name: locale('commands.invite.author', { name: message.author.displayName }), iconURL: message.author.avatarURL() })
                    .setDescription(locale('commands.invite.description'))
                    .addFields({
                        name: locale('commands.invite.fields_1_name', { guild: client.guilds.cache.size.toLocaleString() }),
                        value: locale('commands.invite.fields_1_value', { guilds: client.guilds.cache.size.toLocaleString(), partner: all_guilds.filter(g => g?.partner?.status === 1).length.toLocaleString(), botlist: all_guilds.filter(g => g?.botlist?.status === 1).length.toLocaleString() })
                    })
                    .setFooter({ text: locale('commands.invite.footer', { name: client.user.username }), iconURL: client.user.avatarURL() })
                    .setTimestamp()
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setURL('https://discord.com/oauth2/authorize?client_id=' + client.user.id + '&scope=bot&permissions=8')
                            .setLabel(locale('commands.invite.invite')),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setURL(client.config.main.support)
                            .setLabel(locale('commands.invite.support'))
                    )
            ]
        });
    }
};