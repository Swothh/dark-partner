import { User } from '../../models';
import { HangMan } from '../../lib';
import { Commands } from '../../structures';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';


export const Command: Commands = {
    name: 'gc',
    description: 'hızlı tıklıon.',
    aliases: [],
    category: 'games',
    cooldown: 300000,
    requireds: {
        owner: true
    },
    run: async (client, message, args, locale) => {
        const colors = ['blue', 'green', 'gray', 'red'];

        /*for (let i = 0; i < 4; i++) {
            const random = colors[Math.floor(Math.random() * colors.length)]

            message.channel.send(random)
            selected.push(random);
        };

        console.log(selected);*/

        const msg = await message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.colors.main)
                    .setAuthor({ name: message.author.displayName + ' ' + locale('commands.guessColor.author'), iconURL: message.author.displayAvatarURL() })
                    .setDescription(locale('commands.guessColor.description'))
                    .setFooter({ text: locale('commands.guessColor.footer'), iconURL: client.config.icons.info })
                    .setTimestamp()
            ],
            components: [
                new ActionRowBuilder<StringSelectMenuBuilder>()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('MINIGAME-GUESS-COLOR')
                            .setPlaceholder(locale('commands.guessColor.placeholder'))
                            .addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setValue('easy')
                                    .setLabel(locale('commands.guessColor.easy'))
                                    .setDescription(locale('commands.guessColor.easy_desc'))
                                    .setEmoji(client.config.emojis.easy),
                                new StringSelectMenuOptionBuilder()
                                    .setValue('medium')
                                    .setLabel(locale('commands.guessColor.medium'))
                                    .setDescription(locale('commands.guessColor.medium_desc'))
                                    .setEmoji(client.config.emojis.medium),
                                new StringSelectMenuOptionBuilder()
                                    .setValue('hard')
                                    .setLabel(locale('commands.guessColor.hard'))
                                    .setDescription(locale('commands.guessColor.hard_desc'))
                                    .setEmoji(client.config.emojis.hard),
                                /*new StringSelectMenuOptionBuilder()
                                    .setValue('extreme')
                                    .setLabel(locale('commands.guessColor.extreme'))
                                    .setDescription(locale('commands.guessColor.extreme_desc'))
                                    .setEmoji(client.config.emojis.extreme)*/
                            )
                    )
            ]
        });

        const collector = client.managers.Collector({
            msg,
            channel: message.channel,
            componentType: ComponentType.StringSelect,
            time: 60000,
            filter: i => i.user.id === i.user.id && i.message.id === msg.id
        });

        collector.on('collect', async (i) => {
            if (!i.isStringSelectMenu()) return;

            await i.deferUpdate();

            const difficulty = i.values[0] as string;
            const selected: string[] = [];
            let total = 0;

            if (difficulty === 'easy') total = 3;
            else if (difficulty === 'medium') total = 5;
            else if (difficulty === 'hard') total = 7;

            const getComponents = (select?: string) => {
                const buttons = [];

                for (let i = 0; i < total; i++) {
                    buttons.push(
                        new ButtonBuilder()
                            .setCustomId('MINIGAME-GUESS-COLOR ' + colors[i])
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(client.config.emojis.blank)
                            .setDisabled(select ? select === colors[i] : false)
                    );
                };

                console.log(buttons)

                return new ActionRowBuilder<ButtonBuilder>().addComponents(...buttons);
            };

            await i.message.edit({
                embeds: [],
                components: [getComponents()]
            });

            const changeColorSlowly = async (select: string) => {
                for (let s = 0; s < total; s++) {
                    const random = colors[Math.floor(Math.random() * colors.length)];
                    selected.push(random);

                    await i.message.edit({
                        embeds: [],
                        components: [getComponents(random)]
                    });

                    // Bekleme süresi ekleyin (örneğin, 1000 milisaniye = 1 saniye)
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                // Seçim bittiğinde tüm butonları devre dışı bırak
                await i.message.edit({
                    embeds: [],
                    components: [getComponents()]
                });
            };

            changeColorSlowly(difficulty);
        });

    }
};