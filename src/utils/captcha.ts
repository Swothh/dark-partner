import { EmbedBuilder, AttachmentBuilder, ButtonBuilder, WebhookClient, ComponentType, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { CaptchaGenerator } from 'captcha-canvas';
import { Commands } from '../structures';
import { User } from '../models';
import { nanoid } from 'nanoid';

const emojis = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨',
    '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦',
    '🦆', '🦅', '🦉', '🦇', '🐺', '🐴', '🐝', '🐛', '🦋', 
    '🐌', '🪱', '🐠', '🐬', '🐊', '🐘', '🐏', '🕊️', '🦜'
];

const colors = {
    "gray": "Secondary",
    "blue": "Primary",
    "green": "Success",
    "red": "Danger"
};

export const Captcha: Commands['run'] = (client, message, args, locale) => new Promise(async resolve => {
    if (client.config.main.owners.includes(message.author.id)) return resolve(true);
    const random = (filter?: string) => Object.keys(colors).filter(el => el !== filter)[Math.floor(Math.random() * Object.keys(colors).filter(el => el !== filter).length)];
    let cID: string;

    const check = await User.findOne({ user: message.author.id }).select('captcha');
    if ((Date.now() - (check?.captcha?.last_success ?? 0)) < (1000 * 60 * 60)) return resolve(true);
    
    if (check?.captcha?.banned && Date.now() < check?.captcha?.banned) {
        message.nmReply({
            embeds: [
                new EmbedBuilder()
                    .setColor('#2B2D31')
                    .setTitle(locale('captcha.banned.title'))
                    .setDescription(locale('captcha.banned.desc').replace('{date}', `<t:${Math.round(check?.captcha?.banned / 1000)}:t>`))
            ]
        });

        return resolve(false);
    };

    const totalSteps = 3;
    let step = 1;

    const generate = () => {
        cID = nanoid(16);
        const otherEmojis: number[] = [];

        for(let i = 0; i < 4; i++) {
            const arr = emojis.map((_, i) => i);
            const get = () => arr[Math.floor(Math.random() * arr.length)];

            let rand = get();
            while (otherEmojis.includes(rand)) rand = get();
            otherEmojis.push(rand);
        };

        const emoji = otherEmojis[0];
        const type = random();
        const trueId = nanoid(8);

        const captcha = new CaptchaGenerator()
            .setDimension(150, 450)
            .setCaptcha({ text: locale('captcha.emoji_names.' + emoji).toUpperCase(), color: type })
            .setDecoy({ total: 20, size: 32, color: random(type) })
            .setTrace({ color: type });

        const buttons = [
            new ButtonBuilder()
                .setStyle((ButtonStyle as any)[(colors as any)[type]])
                .setCustomId([ cID, trueId ].join('-'))
                .setEmoji(emojis[emoji]),
            ...Array.from({ length: 9 }).map((_, i) => {
                const [ e, t ] = [ otherEmojis[i < 2 ? 0 : i < 5 ? 1 : i < 7 ? 2 : 3], random(i < 2 ? type : undefined) ];

                return new ButtonBuilder()
                    .setStyle((ButtonStyle as any)[(colors as any)[t]])
                    .setCustomId([ cID, nanoid(8) ].join('-'))
                    .setEmoji(emojis[e] || '❓')
            })
        ];

        buttons.forEach((item, i) => {
            const index = Math.floor(Math.random() * buttons.length);
            const temp = buttons[index];

            buttons[index] = item;
            buttons[i] = temp;
        });

        return [
            [ cID, trueId ].join('-'),
            {
                embeds: [
                    new EmbedBuilder()
                        .setColor('#2B2D31')
                        .setTitle(locale('captcha.title'))
                        .setDescription(locale('captcha.description'))
                        .setFooter({ text: locale('captcha.step').replace('{now}', String(step)).replace('{total}', String(totalSteps)), iconURL: message.author.displayAvatarURL() })
                        .setImage('attachment://captcha.png')
                ],
                files: [
                    new AttachmentBuilder(captcha.generateSync(), {
                        name: 'captcha.png'
                    })
                ],
                components: Array.from({ length: Math.ceil(buttons.length / 5) }).map((_, k) => (
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(...buttons.slice(k * 5, (k + 1) * 5))
                ))
            }
        ] as [string, any];
    };

    let current = generate();
    const msg = await message.nmReply(current[1]);
    const hook = new WebhookClient(client.config.webhooks.captcha);

    const wh = (result: 'failed' | 'success') => {
        hook.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(result === 'success' ? 'Green' : 'Red')
                    .setTitle('Anti-Otomasyon Sonucu')
                    .addFields({
                        name: '— Sonuç',
                        value: result === 'success' ? ':white_check_mark: Geçti' : ':x: Kaldı',
                        inline: true
                    }, {
                        name: '— Tarih',
                        value: `<t:${Math.round(Date.now() / 1000)}>`,
                        inline: true
                    }, {
                        name: '— Komut',
                        value: '`' + (message.content.split(' ')[0] || 'N/A') + '`',
                        inline: true
                    }, {
                        name: '— Geçme Sayısı',
                        value: '`' + String((check?.captcha?.success || 0) + (result === 'success' ? 1 : 0)) + '`',
                        inline: true
                    }, {
                        name: '— Kalma Sayısı',
                        value: '`' + String((check?.captcha?.failed || 0) + (result !== 'success' ? 1 : 0)) + '`',
                        inline: true
                    }, {
                        name: '— Geçme Oranı',
                        value: '`%' + String(((check?.captcha?.success || 0) + (result === 'success' ? 1 : 0)) / (((check?.captcha?.success || 0) + (result === 'success' ? 1 : 0)) + ((check?.captcha?.failed || 0) + (result !== 'success' ? 1 : 0))) * 100) + '`',
                        inline: true
                    })
            ]
        });
    };

    const collector = message.channel.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 1000 * 60 * 3,
        filter: i => {
            i.deferUpdate().catch(() => {});
            return i.message.id === msg.id && i.user.id === message.author.id;
        }
    });

    collector.on('collect', async i => {
        if (i.customId === current[0]) {
            if (step === totalSteps) {
                await Promise.all([
                    wh('success'),
                    msg.delete().catch(() => {}),
                    User.updateOne({ user: message.author.id }, {
                        $set: {
                            'captcha.last_success': Date.now()
                        },
                        $inc: {
                            'captcha.success': 1
                        }
                    }, { upsert: true })
                ]);

                resolve(true);
            } else {
                step++;
                current = generate();
                msg.edit(current[1]).catch(() => {});
            };
        } else {
            wh('failed');

            msg.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#2B2D31')
                        .setTitle(locale('captcha.failed.title'))
                        .setDescription(locale('captcha.failed.desc'))
                ],
                files: [],
                components: []
            }).catch(() => {});

            await User.updateOne({ user: message.author.id }, {
                $set: {
                    'captcha.banned': Date.now() + (1000 * 60 * 60)
                },
                $inc: {
                    'captcha.failed': 1
                }
            }, { upsert: true });

            resolve(false);
        };
    });

    collector.on('end', () => {
        resolve(false);
    });
});