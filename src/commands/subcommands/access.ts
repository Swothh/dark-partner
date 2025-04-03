import { Commands } from '../../structures';
import { Guild } from '../../models';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';

export const Access: Commands['run'] = async (client, message, args, locale) => {
    const guild = await Guild.findOne({ guildId: message.guild.id }, { 'partner.access': true, 'partner.staff': true });
    const user = message.mentions.users.first() || message.guild.members.cache.get(args[0])?.user;

    if (!user) return await message.error(locale('commands.partner.access.user_error'));
    if (user.id === message.author.id) return await message.error(locale('commands.partner.access.self_error'));
    if (user.bot) return await message.error(locale('commands.partner.access.bot_error'));

    if (!guild?.partner?.access.includes(user?.id)) {
        if (guild?.partner?.access?.includes(user.id)) return await message.error(locale('commands.partner.access.already_error'));
        if (message.guild.members.cache.get(user.id)?.roles.cache.has(guild.partner.staff)) return await message.error(locale('commands.partner.access.staff_error'));

        const msg = await message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.colors.main)
                    .setTitle(locale('commands.partner.access.title'))
                    .setDescription(locale('commands.partner.access.description', { user: `<@${user.id}>` }))
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('access.accept')
                            .setLabel(locale('commands.partner.access.accept'))
                            .setStyle(ButtonStyle.Success)
                            .setEmoji('✅'),
                        new ButtonBuilder()
                            .setCustomId('access.deny')
                            .setLabel(locale('commands.partner.access.deny'))
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji('❌')
                    )
            ]
        });

        const collector = client.managers.Collector({
            msg,
            channel: message.channel,
            componentType: ComponentType.Button,
            time: 60000,
            filter: i => i.user.id === message.author.id && i.message.id === msg.id
        });

        collector.on('collect', async i => {
            if (!i.isButton()) return;

            if (i.customId === 'access.accept') {
                if (msg.deletable) await msg.delete().catch(() => { });

                await message.success(locale('commands.partner.access.success', { user: `<@${user.id}>` }));
                await Guild.updateOne({ guildId: message.guild.id }, { $push: { 'partner.access': user.id } });
            } else if (i.customId === 'access.deny') {
                if (msg.deletable) await msg.delete().catch(() => { });
            };
        });
    } else {
        await message.success(locale('commands.partner.access.already_success', { user: `<@${user.id}>` }));
        await Guild.updateOne({ guildId: message.guild.id }, { $pull: { 'partner.access': user.id } });
    };
};