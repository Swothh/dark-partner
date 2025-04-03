import { Commands } from '../../structures';
import { Global } from '../../models';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';

export const Command: Commands = {
    name: 'experiments',
    description: 'Experiments',
    aliases: ['deneyler'],
    category: 'bot',
    cooldown: 5000,
    run: async (client, message, args, locale) => {
        let page = 1;
        let perPage = 10;
        let maxPage = Math.ceil(client.config.experiments.length / perPage);

        const buildEmbed = () => {
            const embed = new EmbedBuilder()
                .setColor(client.config.colors.blank)
                .setDescription(
                    client.config.experiments.slice((page - 1) * perPage, page * perPage).map((experiment, index) => {
                        return `**${page === 1 ? index + 1 : (page - 1) * perPage + index + 1}.** ${experiment.name} ${experiment.locked ? '(🔒)' : ''} - ${experiment.related.map(r => `\`${r}\``).join(', ')}`;
                    }).join('\n')
                )
                .setFooter({ text: 'Page: ' + page + '/' + maxPage })
                .setTimestamp();

            return embed;
        };

        const buildButtons = () => {
            const buttons = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('previous-10')
                        .setLabel('Previous 10')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === 1),
                    new ButtonBuilder()
                        .setCustomId('previous')
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === 1),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === maxPage),
                    new ButtonBuilder()
                        .setCustomId('next-10')
                        .setLabel('Next 10')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(page === maxPage)
                );

            return buttons;
        };

        const msg = await message.nmReply({
            embeds: [buildEmbed()],
            components: [buildButtons()]
        });

        const collector = client.managers.Collector({
            msg,
            channel: message.channel,
            componentType: ComponentType.Button,
            time: 60000,
            filter: i => i.user.id === i.user.id && i.message.id === msg.id,
        });

        collector.on('collect', async (i) => {
            if (i.customId === 'previous-10') {
                page -= 10;
            } else if (i.customId === 'previous') {
                page--;
            } else if (i.customId === 'next') {
                page++;
            } else if (i.customId === 'next-10') {
                page += 10;
            };

            if (page < 1) page = 1;
            if (page > maxPage) page = maxPage;

            await i.update({
                embeds: [buildEmbed()],
                components: [buildButtons()]
            });
        });
    }
};