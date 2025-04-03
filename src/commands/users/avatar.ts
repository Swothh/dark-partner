import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Commands } from '../../structures';

export const Command: Commands = {
    name: 'avatar',
    description: 'Bir kullanıcının profil fotoğrafını gösterir.',
    aliases: ['pp', 'profil-fotoğrafı', 'profil-fotoğraf', 'profil-foto', 'profil-fotoğrafı', 'profil-fotoğraf', 'profil-foto', 'av'],
    category: 'users',
    cooldown: 5000,
    run: async (client, message, args, locale) => {
        const user = (await client.shardManager.eval('GET_USER', { user: message.mentions.users.first()?.id })).data || (await client.shardManager.eval('GET_USER', { user: args[0] })).data || (await client.shardManager.eval('GET_USER', { user: message.author.id })).data;

        const msg = await message.nmReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.config.colors.main)
                    .setAuthor({
                        name: `${user?.displayName ?? user?.username}`,
                        iconURL: `${user?.displayAvatarURL}?size=4096`
                    })
                    .setFooter({
                        text: `${locale('commands.avatar.footer', { user: message.author.displayName })}`,
                        iconURL: message.author.displayAvatarURL()
                    })
                    .setTimestamp()
                    .setImage(`${user?.displayAvatarURL}?size=4096`)
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setLabel(locale('commands.avatar.button_download'))
                            .setURL(`${user?.displayAvatarURL}?size=4096`),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Primary)
                            .setLabel(locale('commands.avatar.button_banner'))
                            .setDisabled(user?.bannerURL === null ? true : false)
                            .setCustomId('avatar.banner'),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji(client.config.emojis.remove)
                            .setCustomId('avatar.delete')
                    )
            ]
        });

        const collector = client.managers.Collector({
            msg,
            filter: (i) => i.user.id === message.author.id && i.message.id === msg.id,
            time: 60000,
            channel: message.channel,
        });

        collector.on('collect', async i => {
            if (!i.isButton()) return;

            if (i.customId === 'avatar.banner') {
                await i.deferUpdate().catch(() => { });

                msg.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.config.colors.main)
                            .setAuthor({
                                name: `${user?.displayName ?? user?.username}`,
                                iconURL: `${user?.displayAvatarURL}?size=4096`
                            })
                            .setFooter({
                                text: `${locale('commands.avatar.footer', { user: message.author.displayName })}`,
                                iconURL: message.author.displayAvatarURL()
                            })
                            .setTimestamp()
                            .setImage(`${user?.bannerURL}?size=4096`)
                    ],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Link)
                                    .setLabel(locale('commands.avatar.button_download'))
                                    .setURL(`${user?.bannerURL}?size=4096`),
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Primary)
                                    .setLabel(locale('commands.avatar.button_avatar'))
                                    .setCustomId('avatar.avatar'),
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Danger)
                                    .setEmoji(client.config.emojis.remove)
                                    .setCustomId('avatar.delete')
                            )
                    ]
                });
            };

            if (i.customId === 'avatar.avatar') {
                await i.deferUpdate().catch(() => { });

                msg.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.config.colors.main)
                            .setAuthor({
                                name: `${user?.displayName ?? user?.username}`,
                                iconURL: `${user?.displayAvatarURL}?size=4096`
                            })
                            .setFooter({
                                text: `${locale('commands.avatar.footer', { user: message.author.displayName })}`,
                                iconURL: message.author.displayAvatarURL()
                            })
                            .setTimestamp()
                            .setImage(`${user?.displayAvatarURL}?size=4096`)
                    ],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Link)
                                    .setLabel(locale('commands.avatar.button_download'))
                                    .setURL(`${user?.displayAvatarURL}?size=4096`),
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Primary)
                                    .setLabel(locale('commands.avatar.button_banner'))
                                    .setCustomId('avatar.banner'),
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Danger)
                                    .setEmoji(client.config.emojis.remove)
                                    .setCustomId('avatar.delete')
                            )
                    ]
                });
            };

            if (i.customId === 'avatar.delete') {
                await i.deferUpdate().catch(() => { });

                if (msg.deletable) msg.delete().catch(() => { });
            };
        });
    }
};