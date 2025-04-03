import { Interaction, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonInteraction, CacheType, ButtonStyle, ComponentType } from 'discord.js';
import { InferSchemaType, set } from 'mongoose';
import { Events } from '../../structures';
import { User, Guild, Requests } from '../../models';
import { Localizer, Tasks } from '../../managers';
import { InteractionUtils, ModalUtils } from '../../utils';

export const Event: Events = {
    name: 'interactionCreate',
    on: 'on',
    run: async (client, interaction: Interaction) => {
        try {
            if (!interaction.isButton() || !interaction.customId.startsWith('partner.rating')) return;
            const targetId = interaction.customId.split('-')[1];

            const i = await InteractionUtils(client, interaction) as ButtonInteraction<CacheType>; // ?? bug olabilir
            const db = await Guild.findOne({ guildId: i.guild.id }, { partner: true });
            const user_db = await User.findOne({ user: interaction.user.id }, { _id: 0, banned: 1, amount: 1, locale: 1 });
            const locale = Localizer(client, user_db);

            if (user_db?.banned?.ban) return i.error(locale('errors.user_banned', { reason: user_db.banned.reason }));
            if (!db || !db?.partner?.text || !db?.partner?.staff || !db?.partner?.channel || db?.partner?.status === 0) return i.error(locale('events.partner.settings_error'));
            if (Array.isArray(i.member.roles)) return i.error(locale('events.partner.role_error'));

            const is_admin = i.memberPermissions.has(PermissionFlagsBits.Administrator);
            const is_staff = i.member.roles.cache.has(db.partner.staff) || db?.partner?.access?.includes(interaction.user.id);
            if (!is_admin && !is_staff) return i.error(locale('events.partner.permission_denied', { role: `${db.partner.staff}` }));

            let rating = 1;
            const generateEmbed = async (rating: number) => {
                return new EmbedBuilder()
                    .setColor('Yellow')
                    .setAuthor({ name: locale('events.partner.rating.author', { user: interaction.user.globalName }), iconURL: interaction.user.displayAvatarURL() })
                    .setTitle(locale('events.partner.rating.title'))
                    .setDescription(locale('events.partner.rating.description'))
                    .addFields((locale as any)(`events.partner.rating.fields`).map((field: any) => ({
                        name: field.name,
                        value: field.value
                            .replace('{stars}', `${rating} ${locale(`events.partner.rating.types.${rating}`)}`)
                            .replace('{preview}', '⭐'.repeat(rating)),
                        inline: field.inline
                    })));
            };



            await interaction.deferUpdate();

            const embeds = interaction.message.embeds;
            const msg = await interaction.message.edit({
                embeds: [await generateEmbed(rating)],
                components: [
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('partner.send_rating-trigger')
                                .setLabel(locale('events.partner.rating.trigger'))
                                .setStyle(ButtonStyle.Success)
                                .setEmoji(client.config.emojis.star),
                            new ButtonBuilder()
                                .setCustomId('partner.send_rating-send')
                                .setLabel(locale('events.partner.rating.send'))
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji(client.config.emojis.send_id)
                        )
                ]
            });

            const collector = client.managers.Collector({
                msg,
                channel: interaction.channel,
                componentType: ComponentType.Button,
                time: 60000,
                filter: i => i.user.id === interaction.user.id && i.message.id === msg.id
            });

            collector.on('collect', async (int) => {
                if (!int.isButton()) return;

                if (int.customId === 'partner.send_rating-trigger') {
                    rating = rating === 5 ? 1 : rating + 1;

                    await int.deferUpdate();
                    await int.message.edit({
                        embeds: [await generateEmbed(rating)]
                    });
                } else if (int.customId === 'partner.send_rating-send') {
                    await int.deferUpdate();
                    await int.message.edit({
                        embeds: embeds,
                        components: [
                            new ActionRowBuilder<ButtonBuilder>()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('partner.send_disabled')
                                        .setLabel(locale('events.partner.rating.sended', { rating: String(rating), user: interaction.user.globalName }))
                                        .setStyle(ButtonStyle.Success)
                                        .setEmoji(client.config.emojis.star)
                                        .setDisabled(true)
                                )
                        ]
                    });
                };
            });
        } catch (err) {
            console.error(err);
        };
    }
};