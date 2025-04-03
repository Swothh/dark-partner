import { EmbedBuilder, Guild, WebhookClient } from 'discord.js';
import { Events } from '../structures';

export const Event: Events = {
    name: 'guildCreate',
    on: 'on',
    run: async (client, g: Guild) => {
        try {
            const w = new WebhookClient(client.config.webhooks.server);
            if (!w) return;

            const user = await client.shardManager.eval('GET_USER', {
                user: g.ownerId
            });
            /*await client.shardManager.eval('SEND_MESSAGE', {
                payload: {
                    content: `**${g.name}** adlı sunucuya eklendi, ${g.memberCount} üye. ${g.ownerId} sahibi. (<@${g.ownerId}> - Username: ${user.data.username} - Globalname: ${user.data.globalName} ${g.ownerId})`,
                },
                channel: c.data[0].id,
                guild: '1144557139512266772'
            });*/

            await w.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.colors.success)
                        .setTitle('🌺 Sunucuya başarıyla eklenildi.')
                        .setDescription('> **Dark**, yepyeni bir sunucuya az önce eklendi.')
                        .addFields({
                            name: '‧ Sunucu Adı',
                            value: g.name,
                            inline: true
                        }, {
                            name: '‧ Sunucu Kimliği',
                            value: g.id,
                            inline: true
                        }, {
                            name: '‧ Sunucu Üyesi',
                            value: g.memberCount.toLocaleString(),
                            inline: true
                        }, {
                            name: '‧ Sunucu Sahibi',
                            value: `<@${g.ownerId}>, ${user.data?.globalName} (${user.data?.username})`,
                            inline: true
                        }, {
                            name: '‧ Sahip Kimliği',
                            value: g.ownerId,
                            inline: true
                        }, {
                            name: '‧ Sunucu Kurulum Tarihi',
                            value: `<t:${Math.floor(g.createdTimestamp / 1000)}:R>`,
                            inline: true
                        })
                ]
            });
        } catch (err) {
            console.error(err);
        };
    }
};