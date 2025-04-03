import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Commands } from '../../structures';

export const Command: Commands = {
    name: 'shard',
    description: 'Sunucunuzun shard bilgilerini görüntülersiniz.',
    aliases: ['shard-info', 'shardinfo', 'shardbilgi', 'shard-bilgi', 'cluster'],
    category: 'users',
    cooldown: 5000,
    run: async (client, message, args, locale) => {
        const shards = await client.shard.broadcastEval(client => ([
            client.shard.ids,
            client.ws.status,
            client.ws.ping,
            client.guilds.cache.size
        ]));

        await message.nmReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.colors.main)
                    .setThumbnail(client.config.icons.crystal)
                    .setAuthor({
                        name: `${locale('commands.shard.author', { client: client.user.username })}`,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setDescription(locale('commands.shard.description', {
                        total_shard: `${client.shard.count}`,
                        total_online_shard: `${shards.filter(s => s[1] === 0).length}`,
                        total_offline_shard: `${shards.filter(s => s[1] !== 0).length}`
                    }))
                    .addFields(...shards.map(([id, status, ping, guilds]) => ({
                        name: `*Shard #${id} ${client.shard.ids[0] == id ? `(${client.config.emojis.activity})` : ''}*`,
                        value: [
                            `• ${locale('commands.shard.fields_1')}: **${status === 0 ? client.config.emojis.online : client.config.emojis.offline}**`,
                            `• ${locale('commands.shard.fields_2')}: **${ping || 0}ms**`,
                            `• ${locale('commands.shard.fields_3')}: **${guilds.toLocaleString()}**`
                        ].join('\n'),
                        inline: true
                    })))
            ]
        });
    }
};