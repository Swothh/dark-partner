import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Commands } from '../../structures';
import { nanoid } from 'nanoid';

export const Command: Commands = {
    name: 'personel',
    description: 'Personele özel işlemler menüsü.',
    aliases: ['staff', 's'],
    category: 'staff',
    cooldown: 10000,
    run: async (client, message, args, locale) => {
        let isDev = client.config.main.owners.includes(message.author.id);

        if (!isDev) {
            const { data } = await client.shardManager.eval('GET_MEMBER', { guild: client.config.main.staffs.support_server_id, member: message.author.id });
            if (!((data?.roles || []) as string[]).includes(client.config.main.staffs.moderator_id)) return message.error(locale('errors.staff_only'));
        };

        isDev = false;

        const ids = [
            'blacklist',
            'coin',
            'warn'
        ].reduce((obj, key) => {
            obj[key] = nanoid();
            return obj;
        }, {} as Record<string, string>);

        const categories = [
            {
                emoji: '1139718408716435577',
                style: ButtonStyle.Secondary,
                actions: [
                    {
                        id: 'blacklist',
                        sub: [
                            {
                                id: 'add',
                                perm: isDev
                            },
                            {
                                id: 'remove',
                                perm: isDev
                            },
                            {
                                id: 'check',
                                perm: true
                            }
                        ] // coin ekle
                    }
                ]
            },
            {
                emoji: '1139718412302565428',
                style: ButtonStyle.Success,
                actions: [
                    {
                        id: 'warn',
                        sub: [
                            {
                                id: 'send',
                                perm: true
                            },
                            {
                                id: 'remove',
                                perm: isDev
                            },
                            {
                                id: 'check',
                                perm: true
                            }
                        ] // seach ekle (sorgu talebi, logs swsine bildirim gidicek, biz cevap vercez)
                    }
                ]
            },
        ];

        /**
         * 
         * uyarı
         * karaliste
         * (coin vs gibi işlemler de olabilir, biraz düşünülsün)
         * (dp personele gerek kalmayabilir)
         * gibi işlemler dbde kayıt altına alınsın.
         * 
         * bütün kontrol işlemleri bir sebep içermelidir
         * stafflar neyi kontrol ediyo log düşülecek.
         * 
         */

        const getComponents = () => categories.map(c => (
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(...Array.from({ length: c.actions.length + 1 }).map((_, i) => i === 0 ? (
                    new ButtonBuilder()
                        .setCustomId(nanoid())
                        .setDisabled(true)
                        .setEmoji(c.emoji)
                        .setStyle(c.style)
                ) : (
                    new ButtonBuilder()
                        .setCustomId(ids[c.actions[i - 1].id])
                        .setDisabled(!c.actions[i - 1].sub.find(s => s.perm))
                        .setStyle(c.style)
                        .setLabel(locale(`commands.staff.actions.${c.actions[i - 1].id}.name`)) // dilden gelmeli
                )))
        ));

        const msg = await message.nmReply({
            components: getComponents()
        });

        const collector = client.managers.Collector({
            msg,
            channel: message.channel,
            filter: (interaction) => interaction.user.id === message.author.id,
            time: 60000
        });

        collector.on('collect', async (i) => {
            console.log(i.customId)
        });
    }
};