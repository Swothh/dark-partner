import { Commands } from '../../../structures';
import { Guild } from '../../../models';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, TextInputBuilder, TextInputStyle, ModalBuilder } from 'discord.js';
import { ModalUtils } from '../../../utils';

export const Must: Commands['run'] = async (client, message, args, locale) => {
    let db = await Guild.findOne({ guildId: message.guild.id });

    const msg = await message.nmReply({
        embeds: [
            new EmbedBuilder()
                .setColor(client.config.colors.main)
                .setAuthor({ name: `${locale('commands.botlist.must.author')} — ${message.author.displayName}`, iconURL: message.author.avatarURL() })
                .setFooter({ text: locale('commands.botlist.must.footer'), iconURL: client.config.icons.paint })
                .setTimestamp()
                .setDescription(locale('commands.botlist.must.description'))
                .addFields(locale('commands.botlist.must.fields') as any)
        ],
        components: [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('botlist.server')
                        .setLabel(locale('commands.botlist.must.server'))
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(client.config.emojis.set_partner_text),
                    new ButtonBuilder()
                        .setCustomId('botlist.topgg')
                        .setLabel(locale('commands.botlist.must.topgg'))
                        .setStyle(db?.botlist?.must?.topgg ? ButtonStyle.Success : ButtonStyle.Danger)
                        .setEmoji(client.config.emojis.set_botlist_must_topgg)
                )
        ]
    });

    const collector = client.managers.Collector({
        msg,
        channel: message.channel,
        componentType: ComponentType.Button,
        time: 60000,
        filter: i => i.user.id === i.user.id && i.message.id === msg.id,
    });

    collector.on('collect', async i => {
        if (!i.isButton()) return;

        if (i.customId === 'botlist.server') {
            const create_modal = new client.managers.ModalManager(client, i);
            const modal = await create_modal.build(`botlist.set_must_server-${Math.floor(Math.random() * 1000)}`, {
                modal: new ModalBuilder()
                    .setTitle(locale('commands.botlist.must.modals.title'))
                    .addComponents(
                        new ActionRowBuilder<TextInputBuilder>()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId('botlist.set_must_server.input')
                                    .setLabel(locale('commands.botlist.must.modals.label'))
                                    .setPlaceholder(locale('commands.botlist.must.modals.placeholder'))
                                    .setStyle(TextInputStyle.Short)
                                    .setRequired(true)
                            )
                    )
            });

            const value = modal.fields.getTextInputValue('botlist.set_must_server.input');
            await modal.deferReply({ ephemeral: true });

            const modal_interaction = await ModalUtils(client, modal);
            if (isNaN(Number(value))) return modal_interaction.error(locale('commands.botlist.must.modals.isNaN_error'));

            await Guild.updateOne({ guildId: message.guild.id }, { $set: { 'botlist.type.must.server': Number(value) } });
            await modal_interaction.success(locale('commands.botlist.must.modals.success', {
                count: value
            }));
        };

        if (i.customId === 'botlist.topgg') {
            db = await Guild.findOne({ guildId: message.guild.id });
            await Guild.updateOne({ guildId: message.guild.id }, { $set: { 'botlist.must.topgg': !db?.botlist?.must?.topgg } }, { upsert: true });

            const components = [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('botlist.server')
                            .setLabel(locale('commands.botlist.must.server'))
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(client.config.emojis.set_partner_text),
                        new ButtonBuilder()
                            .setCustomId('botlist.topgg')
                            .setLabel(locale('commands.botlist.must.topgg'))
                            .setStyle(db?.botlist?.must?.topgg ? ButtonStyle.Success : ButtonStyle.Danger)
                            .setEmoji(client.config.emojis.set_botlist_must_topgg)
                    )
            ];

            await i.update({
                components
            });
        };
    });
};