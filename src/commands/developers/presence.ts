import { EmbedBuilder, PresenceData, ActivityType } from 'discord.js';
import { Commands } from '../../structures';
import Dark from '../../client';

export const Command: Commands = {
    name: 'presence',
    description: 'res',
    aliases: [],
    category: 'developers',
    cooldown: 5000,
    requireds: {
        owner: true
    },
    run: async (client, message, args, locale) => {
        const m = await message.nmReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.colors.blank)
                    .setDescription(`${client.config.emojis.loading} Presence updating on all shards...`)
            ]
        });

        await client.shard.broadcastEval(async (c, { obj }) => {
            obj.activities[0].name = obj.activities[0].name.replace('{shard_no}', String(c.shard.ids[0]));
            c.user.setPresence(obj);
        }, {
            context: {
                obj: {
                    activities: [
                        {
                            name: client.config.main.presence,
                            type: ActivityType.Playing
                        }
                    ]
                }
            }
        }).catch(() => {
            return [];
        });

        await m.edit({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.colors.success)
                    .setDescription(`${client.config.emojis.success} Presence updated on all shards.`)
            ]
        });
    }
};