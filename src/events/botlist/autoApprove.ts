import { EmbedBuilder, GuildMember } from 'discord.js';
import { Events } from '../../structures';
import { User, Guild } from '../../models';
import { Localizer } from '../../managers';

export const Event: Events = {
    name: 'guildMemberAdd',
    on: 'on',
    run: async (client, m: GuildMember) => {
        try {
            const guild_db = await Guild.findOne({ guildId: m.guild.id }, { botlist: true });
            const locale = Localizer(client, guild_db);
            const get_bot = guild_db?.botlist?.queue?.find(b => b.id === m.id);

            if (
                !get_bot ||
                !guild_db ||
                guild_db?.botlist?.status !== 1 ||
                !guild_db?.botlist?.queue?.length
            ) return;

            const channel = m.guild.channels.cache.get(guild_db?.botlist?.log);
            if (!channel || !channel.isTextBased()) return;

            const message = await channel.messages.fetch(get_bot.messageId);
            if (!message) return;

            const bot = await client.utils.GetBot.DISCORD(get_bot.id);
            const discord_member_bot = await m.guild.members.fetch(bot.bot.id).catch(() => null) as GuildMember;
            const discord_member_owner = await m.guild.members.fetch(get_bot.owner).catch(() => null) as GuildMember;
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.main)
                .setAuthor({ name: `${bot.bot.username} ${locale('events.botlist.autoApprove.author')}`, iconURL: `https://cdn.discordapp.com/avatars/${bot.bot.id}/${bot.bot.avatar}.png?size=4096` })
                .setThumbnail(`https://cdn.discordapp.com/avatars/${bot.bot.id}/${bot.bot.avatar}.png?size=4096`)
                .addFields((locale as any)('events.botlist.autoApprove.fields').map((field: any) => ({
                    name: field.name,
                    value: field.value
                        .replace('{bot_name}', bot.bot.username)
                        .replace('{bot_id}', bot.bot.id)
                        .replace('{staff}', locale('events.botlist.autoApprove.staff')),
                    inline: field.inline
                })));

            if (message.deletable) message.delete().catch(() => { });

            await Guild.updateOne({ guildId: m.guild.id }, {
                $pull: {
                    'botlist.queue': { id: get_bot.id }
                },
                $push: {
                    'botlist.bots': {
                        botID: get_bot.id,
                        messageID: message.id,
                        botOwner: get_bot.owner
                    }
                }
            }, { upsert: true });

            if (discord_member_bot && guild_db?.botlist?.autorole?.bot) await discord_member_bot.roles.add(guild_db.botlist.autorole.bot).catch(() => { });
            if (discord_member_owner && guild_db?.botlist?.autorole?.user) await discord_member_owner.roles.add(guild_db.botlist.autorole.user).catch(() => { });

            await channel.send({
                content: `<@${get_bot.owner}>`,
                embeds: [embed]
            });
        } catch (err) {
            console.error(err);
        };
    }
};