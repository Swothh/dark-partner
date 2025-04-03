import { GuildMember, ChannelType, EmbedBuilder } from 'discord.js';
import { Events } from '../../structures';
import { Guild } from '../../models';
import { Localizer } from '../../managers';

export const Event: Events = {
    name: 'guildMemberRemove',
    on: 'on',
    run: async (client, m: GuildMember) => {
        try {
            const guild_db = await Guild.findOne({ guildId: m.guild.id }, { botlist: true });
            const locale = Localizer(client, guild_db);
            const get_bot = guild_db?.botlist?.bots?.filter(b => b.botOwner === m.user.id);

            if (
                !guild_db ||
                guild_db?.botlist?.status !== 1 ||
                get_bot.length === 0
            ) return;

            get_bot.forEach(async b => {
                const member = await m.guild.members.fetch(b.botID).catch(() => { });
                if (member && member.id !== client.user.id) member.kick(locale('events.botlist.leaveGuard.reason'));
            });

            const c = await client.shardManager.shardEval(m.guild.shardId, 'GET_CHANNEL', {
                guild: m.guild.id,
                channel: guild_db.botlist.log,
            });

            if (!c[0] || c[0]?.type !== ChannelType.GuildText) return;
            /*await client.shardManager.shardEval(m.guild.shardId, 'SEND_MESSAGE', {
                guild: m.guild.id,
                channel: guild_db.botlist.log,
                payload: {
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.config.colors.blank)
                            .setAuthor({ name: `${m.user.displayName} — ${locale('events.botlist.leaveGuard.author')}`, iconURL: m.user.displayAvatarURL() })
                            .setDescription(locale('events.botlist.leaveGuard.description', { member: m.user.displayName }))
                            .setFooter({ text: locale('events.botlist.leaveGuard.footer', { count: get_bot.length.toLocaleString() ?? "0" }), iconURL: client.config.icons.warning })
                            .setTimestamp()
                            .setThumbnail(m.user.displayAvatarURL())
                    ]
                }
            });*/

            await client.shardManager.sendMessage(m.guild.id, guild_db.botlist.log, {
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.config.colors.blank)
                        .setAuthor({ name: `${m.user.displayName} — ${locale('events.botlist.leaveGuard.author')}`, iconURL: m.user.displayAvatarURL() })
                        .setDescription(locale('events.botlist.leaveGuard.description', { member: m.user.displayName }))
                        .setFooter({ text: locale('events.botlist.leaveGuard.footer', { count: get_bot.length.toLocaleString() ?? "0" }), iconURL: client.config.icons.warning })
                        .setTimestamp()
                        .setThumbnail(m.user.displayAvatarURL())
                ]
            });

            await Guild.updateOne({ guildId: m.guild.id }, { $pull: { 'botlist.bots': { botOwner: m.user.id } } }, { upsert: true });
        } catch (err) {
            console.error(err);
        };
    }
};