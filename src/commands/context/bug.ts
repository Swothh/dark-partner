import { SlashCommands } from '../../structures';
import { EmbedBuilder, ActionRowBuilder, ContextMenuCommandInteraction, AttachmentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, WebhookClient } from 'discord.js';
import { ModalManager } from '../../managers';

export const Command: SlashCommands = {
    name: 'Report a bug',
    description: `Report a bug.`,
    description_localizations: {
        'tr': 'Bir hata bildirin.',
        'en-GB': 'Report a bug.'
    },
    name_localizations: {
        'tr': 'Hata bildir',
        'en-GB': 'Report a bug'
    },
    run: async (client, interaction: ContextMenuCommandInteraction, locale) => {
        const webhook = new WebhookClient(client.config.webhooks.bug);

        const message = await interaction.channel?.messages?.fetch(interaction.targetId);
        if (message?.author.id !== client.user?.id) return interaction.reply({
            content: locale('commands.context.bug.errors.not_bot_message'),
            ephemeral: true
        });

        const modal_create = new ModalManager(client, interaction);
        const modal = await modal_create.build(`bug.report-${interaction.user.id}-${Math.floor(Math.random() * 1000)}`, {
            modal: new ModalBuilder()
                .setTitle(locale('commands.context.bug.modal.title'))
                .addComponents(
                    new ActionRowBuilder<any>()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId('bug.report-feedback')
                                .setLabel(locale('commands.context.bug.modal.label'))
                                .setPlaceholder(locale('commands.context.bug.modal.placeholder'))
                                .setStyle(TextInputStyle.Paragraph)
                                .setMinLength(5)
                                .setMaxLength(1024)
                                .setRequired(true)
                        )
                )
        });

        await modal.deferReply({ ephemeral: true }).catch(() => { });

        const value = modal.fields.getTextInputValue('bug.report-feedback');
        const json_message = JSON.stringify(message, null, 2);
        const attachment = new AttachmentBuilder(Buffer.from(json_message, "utf-8"), {
            name: `message.json`
        });

        await webhook.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.colors.main)
                    .addFields({
                        name: 'User',
                        value: `<@${interaction.user.id}>`,
                        inline: true
                    }, {
                        name: 'Guild',
                        value: `${interaction.guild.name} (${interaction.guild.id})`,
                        inline: true
                    }, {
                        name: 'Channel',
                        value: `${interaction.channel.name} (${interaction.channel.id})`,
                        inline: true
                    }, {
                        name: 'Command',
                        value: `${message.interaction?.commandName ? 'true' : 'false'} **|** ${message.interaction?.commandName ? message.interaction.commandName : 'Unknown'}`,
                        inline: true
                    }, {
                        name: 'Command Author',
                        value: `${message.interaction?.user ? 'true' : 'false'} **|** ${message.interaction?.user ? message.interaction.user : 'Unknown'}`,
                        inline: true
                    }, {
                        name: 'Message Embeds',
                        value: 'A copy of the message is in the message below.',
                        inline: true
                    }, {
                        name: 'Mentions',
                        value: message.mentions.users.size > 0 ? message.mentions.users.map(user => `<@${user.id}>`).join(', ') : 'No mentions',
                        inline: true
                    }, {
                        name: 'Created Timestamp',
                        value: `<t:${Math.floor(message.createdTimestamp / 1000)}:R>`,
                        inline: true
                    }, {
                        name: 'Edited Timestamp',
                        value: message.editedTimestamp ? `<t:${Math.floor(message.editedTimestamp / 1000)}:R>` : 'Not edited',
                        inline: true
                    }, {
                        name: 'User Feedback',
                        value: 'Feedback is in the message below.'
                    })
            ],
        });

        await webhook.send({
            files: [
                new AttachmentBuilder(Buffer.from(value, 'utf8'), {
                    name: `feedback.txt`
                })
            ]
        });

        /////////////////////////////////////////////
        await webhook.send({
            files: [
                attachment
            ]
        });

        await webhook.send({
            content: '** **',
        });
        /////////////////////////////////////////////

        const build_embed = new EmbedBuilder();
        if (message.embeds.length !== 0) {
            if (message.embeds[0]?.color) build_embed.setColor(message.embeds[0].color);
            if (message.embeds[0]?.description) build_embed.setDescription(message.embeds[0].description);
            if (message.embeds[0]?.fields) message.embeds[0].fields.forEach(field => {
                build_embed.addFields({
                    name: field.name,
                    value: field.value,
                    inline: field.inline
                });
            });
            if (message.embeds[0]?.footer) build_embed.setFooter({
                text: message.embeds[0].footer.text,
                iconURL: message.embeds[0].footer.iconURL
            });
            if (message.embeds[0]?.image) build_embed.setImage(message.embeds[0].image.url);
            if (message.embeds[0]?.thumbnail) build_embed.setThumbnail(message.embeds[0].thumbnail.url);
            if (message.embeds[0]?.title) build_embed.setTitle(message.embeds[0].title);
            if (message.embeds[0]?.url) build_embed.setURL(message.embeds[0].url);
            if (message.embeds[0]?.author) build_embed.setAuthor({
                name: message.embeds[0].author.name,
                iconURL: message.embeds[0].author.iconURL,
                url: message.embeds[0].author.url
            });

            const mapped_attachments = message.attachments.map(attachment => attachment.proxyURL);
            await webhook.send({
                content: message.content ? message.content : null,
                embeds: [
                    build_embed
                ],
                files: [
                    ...mapped_attachments
                ],
            });
        } else {
            const mapped_attachments = message.attachments.map(attachment => attachment.proxyURL);
            await webhook.send({
                content: message.content ? message.content : null,
                files: [
                    ...mapped_attachments
                ],
            });
        };

        await webhook.send({
            content: '-------------------------------------------------------------------------------------------------',
        });

        await modal.followUp({
            content: locale('commands.context.bug.success'),
        });
    }
};