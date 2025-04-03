import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { Commands } from '../../structures';
import { Global } from '../../models';

export const Command: Commands = {
    name: 'help',
    description: 'Help me!',
    aliases: ['yardım', 'yardim'],
    category: 'bot',
    cooldown: 5000,
    run: async (client, message, args, locale) => {
        const schema = locale.getSchema();
        const global = await Global.findOne({ globalId: 'global' });
        const prefix = '!'; // bura swye bağlansın

        const main_embed = new EmbedBuilder()
            .setColor(client.config.colors.main)
            .setAuthor({
                name: message.author.displayName,
                iconURL: message.author.displayAvatarURL()
            })
            .setDescription(locale('commands.help.description', {
                prefix: prefix,
                language: `${schema.emoji} ${schema.name}`,
                shard: `${client.shard?.ids[0] || 0}/${client.shard?.count || 1}`,
                ms: String(client.ws.ping)
            }))
            .addFields({
                name: locale('commands.help.fields_1'),
                value: global?.update ?? locale('commands.help.fields_1_err')
            }, {
                name: locale('commands.help.fields_2'),
                value: locale('commands.help.fields_2_value', {
                    version: client.config.main.version
                })
            }, {
                name: locale('commands.help.fields_3'),
                value: locale('commands.help.fields_3_value')
            })
            .setImage('https://cdn.discordapp.com/attachments/1144006446854439044/1178043176754364537/dp-small-banner.png')

        let page = 1;
        const per_page = 6;
        const max_page = Math.ceil(client.commands.filter(c => !c.requireds?.owner).size / per_page);
        const commands = [...client.commands.values()].filter(c => !c.requireds?.owner);

        const pages = {
            main: {
                embeds: [main_embed],
                components: [
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('help.all')
                                .setEmoji('🗒️')
                                .setStyle(ButtonStyle.Secondary),
                            /*new ButtonBuilder()
                                .setCustomId('help.partner')
                                .setEmoji('1139723676904849458')
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId('help.botlist')
                                .setEmoji('1139722874983284889')
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId('help.reward')
                                .setEmoji('1139723282002759860')
                                .setStyle(ButtonStyle.Secondary)*/
                        )
                ]
            },
            help_all: (cmds: Commands[]) => ({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: message.author.displayName,
                            iconURL: message.author.displayAvatarURL()
                        })
                        .setImage('https://cdn.discordapp.com/attachments/1144006446854439044/1178043176754364537/dp-small-banner.png')
                        .setDescription(cmds.map(c => `**• ${prefix}${c.name} 🠮** ${locale(`cmd.${c.name}.description`) ?? '??'}`).join('\n'))
                ],
                components: [
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('help.all.previous')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(page === 1)
                                .setEmoji(client.config.emojis.previous),
                            new ButtonBuilder()
                                .setCustomId('help.all.page')
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true)
                                .setLabel(`${page}/${max_page}`),
                            new ButtonBuilder()
                                .setCustomId('help.all.next')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(page === max_page)
                                .setEmoji(client.config.emojis.next),
                            new ButtonBuilder()
                                .setCustomId('help.back')
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji(client.config.emojis.back)
                        )
                ]
            })
        };

        const msg = await message
            .nmReply(pages.main);

        const collector = client.managers.Collector({
            msg,
            channel: message.channel,
            componentType: ComponentType.Button,
            filter: i => i.user.id === message.author.id && i.message.id === msg.id,
            time: 60000 * 5
        });

        collector.on('collect', async i => {
            collector.resetTimer();
            i.deferUpdate().catch(() => { });

            const render = {
                main: () => msg.edit(pages.main).catch(console.log),
                helpAll: () => msg.edit(pages.help_all(commands.slice((page - 1) * per_page, page * per_page))).catch(console.log)
            };

            switch (i.customId) {
                case 'help.all':
                    await render.helpAll();
                    break;
                case 'help.back':
                    page = 1;
                    await render.main();
                    break;
                case 'help.all.previous':
                    if (page !== 1) page--;
                    await render.helpAll();
                    break;
                case 'help.all.next':
                    if (page !== max_page) page++;
                    await render.helpAll();
                    break;
            };
        });
    }
};