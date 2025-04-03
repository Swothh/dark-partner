import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { SlashCommands } from '../../structures';
import { Guild } from '../../models';
export const Command: SlashCommands = {
    name: 'clear',
    description: 'You delete messages in the smallest detail.',
    requireds: {
        permissions(Perms) {
            return [
                Perms.ManageMessages
            ];
        },
    },
    name_localizations: {
        'en-GB': 'clear',
        'tr': 'sil'
    },
    description_localizations: {
        'tr': 'En ince detayına kadar mesajları silersiniz.',
        'en-GB': 'You delete messages in the smallest detail.'
    },
    options: [
        {
            name: 'options',
            description: 'Extra options.',
            type: 1,
            name_localizations: {
                'tr': 'seçenekler',
                'en-GB': 'options'
            },
            description_localizations: {
                'tr': 'Ekstra seçenekler.',
                'en-GB': 'Extra options.'
            },
            options: [
                {
                    type: 4,
                    name: 'number',
                    description: 'The number of messages to be deleted.',
                    required: true,
                    name_localizations: {
                        'tr': 'sayı',
                        'en-GB': 'number'
                    },
                    description_localizations: {
                        'tr': 'Silinecek mesaj sayısı.',
                        'en-GB': 'The number of messages to be deleted.'
                    }
                },
                {
                    type: 6,
                    name: 'user',
                    description: 'The owner of the messages to be deleted.',
                    required: false,
                    name_localizations: {
                        'tr': 'kullanıcı',
                        'en-GB': 'user'
                    },
                    description_localizations: {
                        'tr': 'Silinecek mesajların sahibi.',
                        'en-GB': 'The owner of the messages to be deleted.'
                    }
                },
                {
                    type: 3,
                    name: 'content',
                    description: 'The content of the messages to be deleted. (Example: deletes all messages containing bathroom.)',
                    required: false,
                    name_localizations: {
                        'tr': 'içerik',
                        'en-GB': 'content'
                    },
                    description_localizations: {
                        'tr': 'Silinecek mesajların içeriği. (Örnek: kabin yazan tüm mesajları siler.)',
                        'en-GB': 'The content of the messages to be deleted. (Example: deletes all messages containing bathroom.)'
                    }
                },
                {
                    type: 8,
                    name: 'role',
                    description: 'The role that will be in the owner of the messages to be deleted.',
                    required: false,
                    name_localizations: {
                        'tr': 'rol',
                        'en-GB': 'role'
                    },
                    description_localizations: {
                        'tr': 'Silinecek mesajların sahiplerinde olacak rol.',
                        'en-GB': 'The role that will be in the owner of the messages to be deleted.'
                    },
                },
                {
                    type: 5,
                    name: 'bot',
                    description: 'Deletes bot messages.',
                    required: false,
                    name_localizations: {
                        'tr': 'bot',
                        'en-GB': 'bot'
                    },
                    description_localizations: {
                        'tr': 'Bot mesajlarını siler.',
                        'en-GB': 'Deletes bot messages.'
                    }
                },
                {
                    type: 5,
                    name: 'embed',
                    description: 'Specifies that the content of the messages to be deleted must contain embed.',
                    required: false,
                    name_localizations: {
                        'tr': 'embed',
                        'en-GB': 'embed'
                    },
                    description_localizations: {
                        'tr': 'Silinecek mesajların içeriğinde embed olması gerektiğini belirtir.',
                        'en-GB': 'Specifies that the content of the messages to be deleted must contain embed.'
                    }
                },
                {
                    type: 5,
                    name: 'link',
                    description: 'Specifies that the content of the messages to be deleted must contain a link.',
                    required: false,
                    name_localizations: {
                        'tr': 'link',
                        'en-GB': 'link'
                    },
                    description_localizations: {
                        'tr': 'Silinecek mesajların içeriğinde link olması gerektiğini belirtir.',
                        'en-GB': 'Specifies that the content of the messages to be deleted must contain a link.'
                    }
                },
                {
                    type: 5,
                    name: 'image',
                    description: 'Specifies that the content of the messages to be deleted must contain an image.',
                    required: false,
                    name_localizations: {
                        'tr': 'resim',
                        'en-GB': 'image'
                    },
                    description_localizations: {
                        'tr': 'Silinecek mesajların içeriğinde resim olması gerektiğini belirtir.',
                        'en-GB': 'Specifies that the content of the messages to be deleted must contain an image.'
                    }
                }
            ]
        }
    ],
    run: async (client, interaction, locale) => {
        const db = await Guild.findOne({ guildId: interaction.guildId }, { 'partner.log': 1 });
        await interaction.deferReply();

        const options = interaction.options;
        const number = options.get('number');
        const user = options.get('user');
        const content = options.get('content');
        const role = options.get('role');
        const bot = options.get('bot');
        const embed = options.get('embed');
        const link = options.get('link');
        const image = options.get('image');

        const messages = await interaction.channel.messages.fetch({ limit: (number.value as number) }).catch(() => { });
        if (!messages) return await interaction.error(locale('commands.slash.clear.errors.fetchMessages'));

        const filtered = messages.filter((m) => {
            if (number && m.createdTimestamp < Date.now() - 1000 * 60 * 60 * 24 * (number.value as number)) return false;
            if (user && m.author.id !== user.user.id) return false;
            if (content && !m.content.toLowerCase().includes((content.value.toLocaleString().toLowerCase() as string))) return false;
            if (role && !m.member.roles.cache.has(role.role.id)) return false;
            if (bot && !m.author.bot) return false;
            if (embed && !m.embeds.length) return false;
            if (link && !m.content.includes('http')) return false;
            if (image && !m.attachments.size) return false;
            if (db?.partner?.log && interaction.channel.id === db.partner.log && m.author.id === client.user.id) return false;
            return true;
        });

        if (!filtered.size) return await interaction.error(locale('commands.slash.clear.errors.noMessages'));

        const deleted = await interaction.channel.bulkDelete(filtered, true).catch(() => { });
        if (!deleted) return await interaction.error(locale('commands.slash.clear.errors.bulkDelete'));

        await interaction.success(locale('commands.slash.clear.success', { count: deleted.size.toLocaleString() })).catch(() => { });
    }
};