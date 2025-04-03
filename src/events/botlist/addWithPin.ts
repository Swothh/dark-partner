import { Interaction, UserFlagsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonStyle } from 'discord.js';
import { Events } from '../../structures';
import { User, Guild } from '../../models';
import { Localizer } from '../../managers';
import { InteractionUtils, ModalUtils } from '../../utils';

export const Event: Events = {
    name: 'interactionCreate',
    on: 'on',
    run: async (client, interaction: Interaction) => {
        try {
            if (!interaction.isButton() || !interaction.customId.startsWith('botlist.add_bot_pin')) return;

            const user_db = await User.findOne({ user: interaction.user.id }, { _id: 0, banned: 1, amount: 1, locale: 1 });
            const guild_db = await Guild.findOne({ guildId: interaction.guildId }, { botlist: true });
            const locale = Localizer(client, user_db);
            const guild_locale = Localizer(client, guild_db);
            const i = await InteractionUtils(client, interaction);

            const create_modal = new client.managers.ModalManager(client, i);
            const modal = await create_modal.build(`botlist.add_bot_pin_interaction-${Math.floor(Math.random() * 1000)}`, {
                modal: new ModalBuilder()
                    .setTitle(locale('events.botlist.addBot.modals.title'))
                    .addComponents(
                        new ActionRowBuilder<TextInputBuilder>()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId('botlist.add_bot_pin_interaction.input')
                                    .setLabel(locale('events.botlist.addBot.modals.input_pin_label'))
                                    .setPlaceholder('1157779657467379823')
                                    .setStyle(TextInputStyle.Short)
                                    .setMinLength(client.config.limits.botlist_pin_min)
                                    .setMaxLength(client.config.limits.botlist_pin_max)
                                    .setRequired(true)
                            ),
                        new ActionRowBuilder<TextInputBuilder>()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId('botlist.add_bot_pin_interaction.input_2')
                                    .setLabel(locale('events.botlist.addBot.modals.input_1_label'))
                                    .setPlaceholder('1157779657467379823')
                                    .setStyle(TextInputStyle.Short)
                                    .setMinLength(client.config.limits.botlist_input_bot_id_min)
                                    .setRequired(true)
                            ),
                        new ActionRowBuilder<TextInputBuilder>()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId('botlist.add_bot_pin_interaction.input_3')
                                    .setLabel(locale('events.botlist.addBot.modals.input_2_label'))
                                    .setPlaceholder('/, !, ., -')
                                    .setMaxLength(client.config.limits.botlist_input_prefix_max)
                                    .setStyle(TextInputStyle.Short)
                                    .setRequired(true)
                            )
                    )
            });

            const pin = modal.fields.getTextInputValue('botlist.add_bot_pin_interaction.input');
            const botId = modal.fields.getTextInputValue('botlist.add_bot_pin_interaction.input_2');
            const prefix = modal.fields.getTextInputValue('botlist.add_bot_pin_interaction.input_3');
            await modal.deferReply({ ephemeral: true });

            const modal_interaction = await ModalUtils(client, modal);
            const get_bot = await client.utils.GetBot.DISCORD(botId);
            const get_bot_topgg = await client.utils.GetBot.TOPGG(botId);

            if (pin !== guild_db?.botlist.pin) return await modal.error(locale('events.botlist.addBot.errors.invalid_pin'));
            if (!get_bot) return await modal_interaction.error(locale('events.botlist.addBot.errors.invalid_bot_id'));
            if (guild_db?.botlist.blacklists.includes(botId)) return await modal_interaction.error(locale('events.botlist.addBot.errors.bot_blacklisted'));
            if (guild_db?.botlist?.queue?.find(b => b.id === botId)) return await modal_interaction.error(locale('events.botlist.addBot.errors.bot_in_queue'));
            if (!get_bot.application.bot_public) return await modal_interaction.error(locale('events.botlist.addBot.errors.bot_not_public'));
            if (guild_db?.botlist?.must?.topgg && !get_bot_topgg) return await modal_interaction.error(locale('events.botlist.addBot.errors.bot_not_in_topgg'));
            if (get_bot.bot.approximate_guild_count < guild_db?.botlist?.must?.server) return await modal_interaction.error(locale('events.botlist.addBot.errors.bot_not_enough_server'));

            const embed = new EmbedBuilder()
                .setColor(client.config.colors.main)
                .setThumbnail(`https://cdn.discordapp.com/avatars/${get_bot.bot.id}/${get_bot.bot.avatar}.png`)
                .setAuthor({ name: `${get_bot.bot.username} — ${guild_locale('events.botlist.addBot.request.author')}`, iconURL: `https://cdn.discordapp.com/avatars/${get_bot.bot.id}/${get_bot.bot.avatar}.png` })
                .addFields((guild_locale as any)('events.botlist.addBot.request.fields').map((field: any) => ({
                    name: field.name,
                    value: field.value
                        .replace('{bot_name}', get_bot.bot.username)
                        .replace('{bot_prefix}', prefix)
                        .replace('{bot_id}', get_bot.bot.id)
                        .replace('{bot_guilds}', get_bot.bot.approximate_guild_count)
                        .replace('{bot_dbl}', get_bot_topgg ? guild_locale('events.botlist.addBot.request.approved') : guild_locale('events.botlist.addBot.request.unapproved'))
                        .replace('{bot_owner}', `${interaction.user.displayName} *(${interaction.user.username})*`)
                        .replace('{bot_terms}', get_bot.application?.terms_of_service_url ? `[${guild_locale('events.botlist.addBot.request.click')}](${get_bot.application.terms_of_service_url})` : guild_locale('events.botlist.addBot.request.no'))
                        .replace('{bot_privacy}', get_bot.application?.privacy_policy_url ? `[${guild_locale('events.botlist.addBot.request.click')}](${get_bot.application.privacy_policy_url})` : guild_locale('events.botlist.addBot.request.no'))
                        .replace('{bot_website}', get_bot_topgg?.website ? `[${guild_locale('events.botlist.addBot.request.click')}](${get_bot_topgg.website})` : guild_locale('events.botlist.addBot.request.no'))
                        .replace('{bot_support}', get_bot_topgg?.support ? `[${guild_locale('events.botlist.addBot.request.click')}](https://discord.com/${get_bot_topgg.support})` : guild_locale('events.botlist.addBot.request.no'))
                        .replace('{bot_discord_verified}', new UserFlagsBitField(get_bot.bot.public_flags).toArray().includes('VerifiedBot') ? guild_locale('events.botlist.addBot.request.approved') : guild_locale('events.botlist.addBot.request.unapproved'))
                        .replace('{bot_github}', get_bot_topgg?.github ? `[${guild_locale('events.botlist.addBot.request.click')}](${get_bot_topgg.github})` : guild_locale('events.botlist.addBot.request.no'))
                        .replace('{bot_description}', get_bot_topgg?.shortdesc ? get_bot_topgg.shortdesc : get_bot.application.description ? get_bot.application.description : guild_locale('events.botlist.addBot.request.no'))
                        .replace('{bot_tags}', get_bot?.application?.tags?.length ? get_bot.application.tags.map((tag: string) => `\`${tag}\``).join(', ') : get_bot_topgg?.tags?.length ? get_bot_topgg.tags.map((tag: string) => `\`${tag}\``).join(', ') : guild_locale('events.botlist.addBot.request.no')),
                    inline: field.inline
                })))
                .setFooter({ text: guild_locale('events.botlist.addBot.request.footer'), iconURL: client.config.icons.info })
                .setTimestamp();

            const buttons = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('botlist.add_bot_interaction.approve')
                        .setLabel(locale('events.botlist.addBot.request.approve'))
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('botlist.add_bot_interaction.deny')
                        .setLabel(locale('events.botlist.addBot.request.deny'))
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel(locale('events.botlist.addBot.request.view'))
                        .setURL(`https://discord.com/oauth2/authorize?client_id=${get_bot.bot.id}&permissions=0&scope=bot%20applications.commands`)
                );

            const channel = await client.channels.fetch(guild_db.botlist.log);
            if (!channel || !channel.isTextBased()) return await modal_interaction.error(locale('events.botlist.addBot.errors.invalid_channel'));

            const msg = await channel.send({
                content: `<@&${guild_db.botlist.staff}>`,
                embeds: [embed],
                components: [buttons]
            });

            await Guild.updateOne({ guildId: interaction.guildId }, { $push: { 'botlist.queue': { id: get_bot.bot.id, owner: interaction.user.id, prefix, messageId: msg.id } } }, { upsert: true });
            await modal_interaction.success(locale('events.botlist.addBot.request.success', {
                bot_name: get_bot.bot.username
            }));
        } catch (err) {
            console.error(err);
        };
    }
};