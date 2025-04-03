import { EmbedBuilder, GuildMember, Interaction, PermissionFlagsBits } from 'discord.js';
import { Events } from '../../structures';
import { User, Guild } from '../../models';
import { Localizer } from '../../managers';

export const Event: Events = {
    name: 'interactionCreate',
    on: 'on',
    run: async (client, i: Interaction) => {
        try {
            if (!i.isButton() || !i.customId.startsWith('botlist.add_bot_interaction.approve')) return;

            const guild_db = await Guild.findOne({ guildId: i.guild.id }, { botlist: true });
            const locale = Localizer(client, guild_db);
            const get_bot = guild_db?.botlist?.queue?.find(b => b.messageId === i.message.id);

            if (
                !get_bot ||
                !guild_db ||
                guild_db?.botlist?.status !== 1
            ) return;

            const channel = i.guild.channels.cache.get(guild_db?.botlist?.log);
            if (!channel || !channel.isTextBased()) return;

            const message = await channel.messages.fetch(get_bot.messageId);
            if (!message) return;

            if (Array.isArray(i.member.roles)) return i.error(locale('events.partner.role_error'));
            const is_admin = i.memberPermissions.has(PermissionFlagsBits.Administrator);
            const is_staff = i.member.roles.cache.has(guild_db.botlist.staff);
            const int = await client.utils.InteractionUtils(client, i);
            if (!is_admin && !is_staff) {
                await i.deferReply({ ephemeral: true });
                await int.error(locale('events.partner.permission_denied', { role: `${guild_db.botlist.staff}` }));
                return;
            };

            await i.deferUpdate();
            const bot = await client.utils.GetBot.DISCORD(get_bot.id);
            const discord_member_bot = await i.guild.members.fetch(bot.bot.id).catch(() => null) as GuildMember;
            const discord_member_owner = await i.guild.members.fetch(get_bot.owner).catch(() => null) as GuildMember;
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.main)
                .setAuthor({ name: `${bot.bot.username} ${locale('events.botlist.autoApprove.author')}`, iconURL: `https://cdn.discordapp.com/avatars/${bot.bot.id}/${bot.bot.avatar}.png?size=4096` })
                .setThumbnail(`https://cdn.discordapp.com/avatars/${bot.bot.id}/${bot.bot.avatar}.png?size=4096`)
                .addFields((locale as any)('events.botlist.autoApprove.fields').map((field: any) => ({
                    name: field.name,
                    value: field.value
                        .replace('{bot_name}', bot.bot.username)
                        .replace('{bot_id}', bot.bot.id)
                        .replace('{staff}', `<@${i.user.id}>`),
                    inline: field.inline
                })))
                .setFooter({ text: locale('events.botlist.autoApprove.footer'), iconURL: client.config.icons.warning })
                .setTimestamp();

            if (message.deletable) message.delete().catch(() => { });

            await Guild.updateOne({ guildId: i.guild.id }, {
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