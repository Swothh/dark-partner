import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, ColorResolvable } from 'discord.js';
import { Commands } from '../../structures';
import { User } from '../../models';
import { Tasks } from '../../managers';
import moment from 'moment';
import 'moment-duration-format';

export const Command: Commands = {
    name: 'tasks',
    description: 'desc.task',
    aliases: ['quests', 'task', 'quest', 'görevler', 'görev', 'görevlerim', 'görevim'],
    category: 'users',
    cooldown: 5000,
    run: async (client, message, args, locale) => {
        let db = await User.findOne({ user: message.author.id }, { quests: true, lastQuest: true, amount: true });
        if (!db?.lastQuest) {
            const task = new Tasks();
            for (let i = 0; i < 3; i++) {
                await task.set(message.author.id);
            };

            db = await User.findOne({ user: message.author.id }, { quests: true, lastQuest: true, amount: true });
        };

        const msg = await message.channel.send({
            embeds: db?.quests?.length === 0 ? [
                new EmbedBuilder()
                    .setColor('Blue')
                    .setAuthor({ name: locale('commands.tasks.author', { user: message.author.globalName }), iconURL: message.author.avatarURL() })
                    .setDescription(locale('commands.tasks.no_tasks_found', { time: (moment.duration(db.lastQuest + 43200000 - Date.now()) as any).format(locale('format')) }))
                    .setFooter({ text: db?.quests?.length >= 3 ? locale('commands.tasks.no_to_the_next') : locale('commands.tasks.to_the_next', { time: (moment.duration(db.lastQuest + 43200000 - Date.now()) as any).format(locale('format')) }), iconURL: db?.quests?.length >= 3 ? client.config.icons.warning : client.config.icons.time })
                    .setTimestamp()
            ] : [
                new EmbedBuilder()
                    .setColor('Blue')
                    .setAuthor({ name: locale('commands.tasks.author', { user: message.author.globalName }), iconURL: message.author.avatarURL() })
                    .addFields(
                        db.quests.map((q, i) => {
                            return {
                                name: locale(`commands.tasks.difficulty_${q.difficulty}`) + locale('commands.tasks.title', { number: (i + 1).toLocaleString() }),
                                value: [
                                    '▬▬▬▬▬▬▬▬▬▬▬',
                                    locale('commands.tasks.task', { task: locale(`commands.tasks.types.${q.type}`) }),
                                    '**—** ' + locale(`commands.tasks.types.${q.type}_desc`, { amount: q.amount.toLocaleString() }),
                                    '',
                                    locale('commands.tasks.time', { time: `<t:${Math.floor(q.date / 1000)}:R>` }),
                                    locale('commands.tasks.prize', { prize: q.prize.toLocaleString() }),
                                    '',
                                    locale('commands.tasks.progress', { percent: Math.floor(q.collected / q.amount * 100).toLocaleString(), collected: q.collected.toLocaleString(), required: q.amount.toLocaleString() }),
                                    client.utils.ProgressBar(q.collected, q.amount, 8, true),
                                ].join('\n'),
                                inline: true
                            };
                        })
                    )
                    .setFooter({ text: db?.quests?.length >= 3 ? locale('commands.tasks.no_to_the_next') : locale('commands.tasks.to_the_next', { time: (moment.duration(db.lastQuest + 43200000 - Date.now()) as any).format(locale('format')) }), iconURL: db?.quests?.length >= 3 ? client.config.icons.warning : client.config.icons.time })
                    .setTimestamp()
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('tasks.refresh')
                            .setLabel(locale('commands.tasks.refresh', { amount: client.utils.is12HoursPassed(db.lastQuest) ? locale('commands.tasks.free') : client.config.prices.tasks_refresh.toLocaleString() + ' ' + 'Coin' }))
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(client.config.emojis.refresh)
                            .setDisabled(db?.quests?.length < 1)
                    )
            ]
        });

        const collector = client.managers.Collector({
            msg,
            channel: message.channel,
            componentType: ComponentType.Button,
            time: 60000,
            filter: i => i.user.id === i.user.id && i.message.id === msg.id
        });

        collector.on('collect', async i => {
            if (!i.isButton()) return;

            if (i.customId === 'tasks.refresh') {
                await i.deferUpdate();

                const price = client.utils.is12HoursPassed(db.lastQuest) ? 0 : client.config.prices.tasks_refresh;
                if (db.amount < price) {
                    await i.deferReply({ ephemeral: true });
                    await i.error(locale('commands.tasks.no_money', { amount: price.toLocaleString() }));

                    return;
                };

                const task = new Tasks();
                await task.removeAll(message.author.id);
                for (let i = 0; i < db.quests.length; i++) {
                    await task.set(message.author.id);
                };

                if (price !== 0) await User.updateOne({ user: message.author.id }, {
                    $inc: {
                        amount: -price
                    },
                    $push: {
                        history: {
                            reason: 'quest',
                            amount: -price,
                            staff: 'System',
                            date: Date.now()
                        }
                    }
                }, {
                    upsert: true
                });

                db = await User.findOne({ user: message.author.id }, { quests: true, lastQuest: true, amount: true });
                await i.message.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Blue')
                            .setAuthor({ name: locale('commands.tasks.author', { user: message.author.globalName }), iconURL: message.author.avatarURL() })
                            .addFields(
                                db.quests.map((q, i) => {
                                    return {
                                        name: locale(`commands.tasks.difficulty_${q.difficulty}`) + locale('commands.tasks.title', { number: (i + 1).toLocaleString() }),
                                        value: [
                                            '▬▬▬▬▬▬▬▬▬▬▬',
                                            locale('commands.tasks.task', { task: locale(`commands.tasks.types.${q.type}`) }),
                                            '**—** ' + locale(`commands.tasks.types.${q.type}_desc`, { amount: q.amount.toLocaleString() }),
                                            '',
                                            locale('commands.tasks.time', { time: `<t:${Math.floor(q.date / 1000)}:R>` }),
                                            locale('commands.tasks.prize', { prize: q.prize.toLocaleString() }),
                                            '',
                                            locale('commands.tasks.progress', { percent: Math.floor(q.collected / q.amount * 100).toLocaleString(), collected: q.collected.toLocaleString(), required: q.amount.toLocaleString() }),
                                            client.utils.ProgressBar(q.collected, q.amount, 8, true),
                                        ].join('\n'),
                                        inline: true
                                    };
                                })
                            )
                            .setFooter({ text: db?.quests?.length >= 3 ? locale('commands.tasks.no_to_the_next') : locale('commands.tasks.to_the_next', { time: (moment.duration(db.lastQuest + 43200000 - Date.now()) as any).format(locale('format')) }), iconURL: db?.quests?.length >= 3 ? client.config.icons.warning : client.config.icons.time })
                            .setTimestamp()
                    ],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('tasks.refresh')
                                    .setLabel(locale('commands.tasks.refresh', { amount: client.utils.is12HoursPassed(db.lastQuest) ? locale('commands.tasks.free') : client.config.prices.tasks_refresh.toLocaleString() + ' ' + 'Coin' }))
                                    .setStyle(ButtonStyle.Primary)
                                    .setEmoji(client.config.emojis.refresh)
                                    .setDisabled(true)
                            )
                    ]
                });
            };
        });
    }
};