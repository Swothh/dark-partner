import { Events } from '../../structures';
import { User, Guild } from '../../models';
import { Localizer } from '../../managers';
import { Interaction, EmbedBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ModalBuilder, PermissionFlagsBits } from 'discord.js';

export const Event: Events = {
    name: 'interactionCreate',
    on: 'on',
    run: async (client, i: Interaction) => {
        try {
            if (!i.isButton() || !i.customId.startsWith('botlist.add_bot_interaction.deny')) return;

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

            const create_modal = new client.managers.ModalManager(client, i);
            const modal = await create_modal.build(`botlist.reject_bot_modal-${Math.floor(Math.random() * 1000)}`, {
                modal: new ModalBuilder()
                    .setTitle(locale('events.botlist.reject.modals.title'))
                    .addComponents(
                        new ActionRowBuilder<TextInputBuilder>()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId('botlist.reject_bot.input')
                                    .setLabel(locale('events.botlist.reject.modals.input_label'))
                                    .setPlaceholder(locale('events.botlist.reject.modals.input_placeholder'))
                                    .setStyle(TextInputStyle.Paragraph)
                                    .setMinLength(client.config.limits.botlist_reject_min)
                                    .setMaxLength(client.config.limits.botlist_reject_max)
                            )
                    )
            });

            const reason = modal.fields.getTextInputValue('botlist.reject_bot.input');
            await modal.deferUpdate();

            const bot = await client.utils.GetBot.DISCORD(get_bot.id);
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.error)
                .setAuthor({ name: `${bot.bot.username} ${locale('events.botlist.reject.author')}`, iconURL: `https://cdn.discordapp.com/avatars/${bot.bot.id}/${bot.bot.avatar}.png?size=4096` })
                .setThumbnail(`https://cdn.discordapp.com/avatars/${bot.bot.id}/${bot.bot.avatar}.png?size=4096`)
                .addFields((locale as any)('events.botlist.reject.fields').map((field: any) => ({
                    name: field.name,
                    value: field.value
                        .replace('{bot_name}', bot.bot.username)
                        .replace('{bot_id}', bot.bot.id)
                        .replace('{staff}', `<@${i.user.id}>`)
                        .replace('{reason}', reason || locale('events.botlist.reject.no_reason')),
                    inline: field.inline
                })))
                .setFooter({ text: locale('events.botlist.reject.footer'), iconURL: client.config.icons.info })
                .setTimestamp();

            if (message.deletable) message.delete().catch(() => { });

            await Guild.updateOne({ guildId: i.guild.id },
                {
                    $pull: {
                        'botlist.queue': { id: get_bot.id }
                    }
                }, { upsert: true });
            await channel.send({
                content: `<@${get_bot.owner}>`,
                embeds: [embed]
            });
        } catch (err) {
            console.error(err);
        };
    }
};